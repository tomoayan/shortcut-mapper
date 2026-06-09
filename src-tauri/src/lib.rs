#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      
      app.handle().plugin(tauri_plugin_updater::Builder::new().build())?;
      
      let handle = app.handle().clone();
      tauri::async_runtime::spawn(async move {
          use tauri_plugin_updater::UpdaterExt;
          if let Ok(Some(update)) = handle.updater().unwrap().check().await {
              let _ = update.download_and_install(|_, _| {}, || {}).await;
              handle.restart();
          }
      });

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
