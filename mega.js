const mega = require("megajs");

const megaConfig = {
  email: 'darkwebagent096@gmail.com',
  password: 'Darknetofficialgh@@2144',
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246"
};

const upload = (fileStream, fileName) => {
  return new Promise((resolve, reject) => {
    console.log('Initializing MEGA storage...');
    
    const storage = new mega.Storage(megaConfig);
    
    storage.on('ready', () => {
      console.log('MEGA storage is ready for upload');
      
      const uploadOptions = {
        name: fileName,
        allowUploadBuffering: true
      };
      
      try {
        console.log('Starting upload process for:', fileName);
        const uploadStream = storage.upload(uploadOptions);
        
        // Pipe the file stream to MEGA upload
        fileStream.pipe(uploadStream);
        
        uploadStream.on('complete', (file) => {
          console.log('File upload completed, generating download link...');
          
          file.link((error, fileLink) => {
            if (error) {
              console.error('Error generating link:', error);
              storage.close();
              reject(error);
              return;
            }
            
            console.log('File uploaded successfully! Link:', fileLink);
            storage.close();
            resolve(fileLink);
          });
        });
        
        uploadStream.on('error', (error) => {
          console.error('Upload stream error:', error);
          storage.close();
          reject(error);
        });
        
        uploadStream.on('progress', (progress) => {
          console.log('Upload progress:', progress);
        });
        
      } catch (error) {
        console.error('Error during upload setup:', error);
        storage.close();
        reject(error);
      }
    });
    
    storage.on('error', (error) => {
      console.error('Storage initialization error:', error);
      reject(error);
    });
    
    storage.on('authError', (error) => {
      console.error('MEGA authentication error:', error);
      reject(error);
    });
    
    // Set timeout for storage initialization
    setTimeout(() => {
      if (!storage.ready) {
        console.error('Storage initialization timeout');
        storage.close();
        reject(new Error('Storage initialization timeout'));
      }
    }, 30000); // 30 second timeout
  });
};

// Test function to verify MEGA connection
const testMegaConnection = () => {
  return new Promise((resolve, reject) => {
    console.log('Testing MEGA connection...');
    
    const storage = new mega.Storage(megaConfig);
    
    storage.on('ready', () => {
      console.log('MEGA connection test successful');
      storage.close();
      resolve(true);
    });
    
    storage.on('error', (error) => {
      console.error('MEGA connection test failed:', error);
      storage.close();
      reject(error);
    });
    
    setTimeout(() => {
      storage.close();
      reject(new Error('Connection test timeout'));
    }, 15000);
  });
};

module.exports = {
  upload,
  testMegaConnection,
  megaConfig
};
