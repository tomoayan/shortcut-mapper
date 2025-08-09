export const navSettings = {
    heading: "",
    description: "",
    section: {
        subHeading: "",
        tooltip: "",
        items: [
            {
                type: 'toggle',
                name: "",
                callback: `callback fn ref`,
                abortSignal: `AbortControllerSignal ref`
            },
            {
                type: 'slider',
                name: "",
                callback: `callback fn ref`,
                abortSignal: `AbortControllerSignal ref`
            },
            {
                type: 'select',
                options: [
                    {
                        name: "",
                        value: "",
                    }
                ],
                callback: `callback fn ref`,
                abortSignal: `AbortControllerSignal ref`
            },
        ]
    }
}