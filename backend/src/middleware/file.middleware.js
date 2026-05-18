const middleware = require("multer");

const upload = middleware({
    storage: middleware.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024 * 10
    }
})

module.exports = upload