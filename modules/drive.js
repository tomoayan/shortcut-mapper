// const shortcutFileName = 'keyboard-shortcut-list.json'
const shortcutFileName = 'keyboard-shortcut-listdsgggghighigs.json'
const client_id = '1017733844904-lo7r0pbu102mecmbpjktqb1nd64ndbj0.apps.googleusercontent.com'
let tokenClient;
let accessToken = {
    token: null,
    expiry: null // time in ms
};

// other vars
let tokenRefreshPromiseProxy;
let loggedPromiseProxy;

let cloudShortcutJSON = {};
let shortcutFileId;

// html elements
let login_btn = document.getElementById('auth_login')





// Prepare necessary scripts on DOM Load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load GIS script manually
        await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load GIS script'));
            document.head.appendChild(script);
        });

        // Load Hash WASM script manually
        await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/hash-wasm@4/dist/md5.umd.min.js';
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load Hash-WASM'));
            document.head.appendChild(script);
        });;

        // Init Oauth2
        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id,
            scope: 'https://www.googleapis.com/auth/drive.appdata',
            callback: (tokenResponse) => {
                const expiresInSeconds = tokenResponse.expires_in;
                accessTokenExpiryTime = Date.now() + (expiresInSeconds * 1000) - 5000; // Calculate absolute expiry time and subtract 5000ms
                accessToken = {
                    token: tokenResponse.access_token,
                    expiry: accessTokenExpiryTime
                };

                if (tokenRefreshPromiseProxy) {
                    console.log('Got one')
                    tokenRefreshPromiseProxy.resolve()
                    tokenRefreshPromiseProxy = null;
                    return
                }
                console.log('Got an access token')
                loggedPromiseProxy.resolve()
            },
            error_callback: (errRes) => {
                if (tokenRefreshPromiseProxy) {
                    tokenRefreshPromiseProxy.reject(new Error(errRes.error));
                    tokenRefreshPromiseProxy = null;
                    console.error('Error while refreshing access token')
                    console.error(errRes.error)
                    return
                }
                console.error('Error while fetching access token')
                loggedPromiseProxy.reject()
            }

        });

        login_btn.disabled = false;
    } catch (err) {
        alert(err.message);
    }
});


// Check token isExist or isValid
const checkToken = () => {
    return new Promise(async (resolve, reject) => {
        if (!accessToken.token) {
            alert('Login first!');
            return reject();
        };

        if (Date.now() >= accessToken.expiry) {
            const refreshToken = new Promise((resolve, reject) => {
                resolveAccessTokenPromise = { resolve, reject };
                tokenClient.requestAccessToken();
            });

            console.log("Access token is missing or expired. Requesting a new one...");
            try {
                await refreshToken()
                return resolve()
            } catch (e) {
                return reject()
            }
        }

        return resolve()
    })
}





// Login
login_btn.addEventListener('click', async (e) => {
    if (!tokenClient) return alert('Google Identity Services not ready! Please try again in a moment');
    const logged = new Promise((resolve, reject) => {
        loggedPromiseProxy = {
            resolve,
            reject
        }
    })
    tokenClient.requestAccessToken();
    try {
        await logged;

        login_btn.textContent = "Switch Account"

        // const fileList = await listFiles(true)
        let filesFound = await listFiles()


        // 1. File doesn't exist in appDataFolder
        //     - Check site cache for shortcut data
        //     - Upload it
        // 2. File already exists in appDataFolder
        //     - download the file
        //     - validate the json
        //     - compare it with local shortcut data
        //         - on conflict,
        //         - try to self resolve by checking the modification time and device id/name
        //         - if file was updated on a different device, ask user which one to keep?
        //     - update site cache
        // 3. Multiple shortcut files found
        //     - TODO: ask user to delete unwanted files by accessing through my web ui

        // No Files Found
        if (filesFound.length === 0) {
            console.info(`No ${shortcutFileName} found in appDataFolder, uploading a new one`)

            try {
                const res = await uploadFile(cloudShortcutJSON)
                console.log(res)
                shortcutFileId = res.id
                console.info('uploaded')
            } catch (err) {
                switch (err) {
                    case "fileContent isn't json object":
                        console.error('cannot upoad: file content is not in json format. please remove site cache and try again')
                        break;
                    case 'token could not refresh':
                        console.error('could not refresh oauth token. logout and login again')
                        break
                    case 'fetch error':
                        console.warn('unable to reach the server to make an api call, retrying...')
                        break
                    case 'server error':
                        console.error('server returned an error')
                        break
                    case 'returned list shows 0 files':
                        console.error('uploaded file got vanished! Maybe a server error? (hope so)')
                        break
                    case 'checksum not matched':
                        console.warn('checksum not matched with uploaded file, retrying...')
                        break
                    case 'multiple shortcut files found':
                        console.error("multiple shortcut files found! that's strange.\nDelete unwanted files using the web view")
                    default:
                        console.error(err)
                        throw new Error("Unknow error found. Open a github issue");
                        break;
                }
                console.info('think, this is a bug? Open an issue in github')


                if (err === 'fetch error' || err === 'checksum not matched') {
                    (async () => {
                        for (let step = 0; step <= 3; step++) {
                            try {
                                const res = await uploadFile(cloudShortcutJSON)
                                shortcutFileId = res.id
                                console.info('uploaded')
                                break
                            } catch (err) {
                                console.warn(err)
                                if (step === 3) console.error('tried 3 times')
                            }
                        }
                    })();
                }
            }

            return
        }


        // File Found
        if (filesFound.length === 1) {
            console.log('file found')
            try {
                shortcutFileId = filesFound[0].id;
                const fileJSON = await downloadFile(filesFound[0].id)
                return cloudShortcutJSON = fileJSON;
            } catch (err) {
                console.error('got an error while download shortcut file')
                switch (err) {
                    case 'fileId is not number':
                        console.error(err)
                        break;
                    case 'fetch error':
                        console.warn('unable to reach the server to make an api call, retrying...')
                        break
                    case 'minetype mismatch':
                        console.error('downloaded shortcut file minetype mismathed. Does not have application/json minetype')
                        break
                    case 'server error':
                        console.error('server returned an error')
                        break
                    default:
                        console.error(err)
                        throw new Error("Unknow error found. Open a github issue");
                }

                // TODO: what if json file structure was invalid
                if (err === 'fetch error') {
                    (async () => {
                        for (let step = 0; step <= 3; step++) {
                            try {
                                const fileJSON = await downloadFile(filesFound[0].id)
                                cloudShortcutJSON = fileJSON;
                                break
                            } catch (err) {
                                console.warn(err)
                                if (step === 3) console.error('tried 3 times')
                            }
                        }
                    })();
                }
            }
        }


        // File Found But Have Multiple Copies
        if (filesFound.length > 1) {
            console.log(`Multiple saved shortcut files found with the name of ${shortcutFileName}. \nTotal count: ${filesFound.length}`);
            alert(`Multiple shortcut files found! Total: ${filesFound.length}`)
            // alert('multiple shortcut files found in drive. aborting...')
            // if (confirm('multiple shortcut files found in drive. delete all and reload page?')) {
                // filesFound.forEach(async (file) => await deleteFile(file.id))
                // window.location.reload();
            // }
        }


    } catch (error) {
        throw new Error("Could not able to login");
    }
})










// Listing File
const listFiles = (raw) => {
    return new Promise(async (resolve, reject) => {
        // Validate Token
        try {
            await checkToken()
        } catch (err) {
            console.error(err)
            // console.warn('token expired, get fileList stopped')
            return reject('token could not refresh')
        }

        // Get Files List
        let resRaw, res;
        try {
            resRaw = await fetch(
                'https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&fields=files(id,name,modifiedTime,mimeType,md5Checksum)',
                {
                    headers: {
                        Authorization: `Bearer ${accessToken.token}`
                    }
                }
            )
            res = await resRaw.json()
        } catch (err) {
            // console.error('error while fetching fileLists or converting it to json')
            console.error(err)
            return reject('fetch error')
        }

        if (!resRaw.ok) {
            // console.error('server error, please try again')
            console.error(res.error)
            return reject('server error')
        }

        if ((typeof raw) == "boolean" && raw) {
            return resolve(res)
        }

        const filesFound = res.files.filter(file => file.name === shortcutFileName)
        resolve(filesFound)
    })
}










// Upload File
const uploadFile = (fileContent) => {
    return new Promise(async (resolve, reject) => {
        if (typeof fileContent === 'object' && Array.isArray(fileContent)) return reject("fileContent isn't json object")

        // Validate Token
        try {
            await checkToken()
        } catch (err) {
            // console.warn('token expired, uploadFile stopped')
            return reject('token could not refresh')
        }


        const fileContentString = JSON.stringify(fileContent);
        const fileContentMd5Hash = await hashwasm.md5(fileContentString) // file content hash
        const metadata = {
            name: shortcutFileName,
            parents: ['appDataFolder'],
        };
        const boundary = crypto.randomUUID();
        const delimiter = `\r\n--${boundary}\r\n`;
        const close_delimiter = `\r\n--${boundary}--`;
        const body =
            delimiter +
            'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            'Content-Type: application/json\r\n\r\n' +
            fileContentString +
            close_delimiter;

        let res;
        try {
            res = await fetch(
                'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + accessToken.token,
                        'Content-Type': `multipart/related; boundary=${boundary}`
                    },
                    body: body
                }
            );
        } catch (err) {
            // console.error("fetch error while uploading to appDataFolder");
            console.error(err)
            return reject('fetch error');
        }

        if (!res.ok) {
            // console.error('upload failed');
            console.error(res)
            return reject('server error');
        }

        // checksum
        const fileList = await listFiles();
        if (fileList.length === 0) return reject('returned list shows 0 files'); // extremely rare
        if (fileList.length === 1) {
            if (fileList[0].md5Checksum === fileContentMd5Hash) {
                console.log('checksum matched: ' + fileList[0].md5Checksum);
                return resolve(await res.json())
            } else {
                return reject('checksum not matched')
            }
        }
        if (fileList.length > 1) reject('multiple shortcut files found')
    })
}






// Download File
const downloadFile = (fileId, fileName) => {
    return new Promise(async (resolve, reject) => {
        if (typeof fileId === 'number') return reject('fileId is not number');

        let fileRes
        try {
            fileRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
                headers: {
                    Authorization: `Bearer ${accessToken.token}`
                }
            })
        } catch (err) {
            return reject('fetch error')
        }

        if (!fileRes.ok) return reject('server error')

        const contentType = fileRes?.headers?.get('Content-Type')
        if (!(contentType === 'application/json')) return reject('minetype mismatch');

        resolve(fileRes.json())


        // download the file
        // fetch('...').then(blob => {
        //     const url = URL.createObjectURL(blob);
        //     const a = document.createElement('a');
        //     a.href = url;
        //     a.download = fileName;
        //     document.body.appendChild(a);
        //     a.click();
        //     a.remove();
        //     URL.revokeObjectURL(url);
        //     console.log(`✅ Downloaded: ${fileName}`);
        // })
        // .catch(err => {
        //     console.log('❌ Error downloading file: ' + err.message);
        // });
    })
}





// Delete File
const deleteFile = (fileId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetch(
                `https://www.googleapis.com/drive/v3/files/${fileId}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${accessToken.token}`
                    }
                }
            );

            if (res.status === 204) {
                console.error(`🗑️ File deleted: ${fileId}`);
                resolve()
            } else {
                const err = await res.json();
                console.error(`Failed to delete: ${err.error.message}`);
                reject()
            }
        } catch (error) {
            console.error('error while delete')
            console.error(error)
            reject()
        }
    })
}