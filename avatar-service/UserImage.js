const {loadImage} = require('canvas');

const UPLOAD_PATH = './uploads';

const TYPE_AVATAR = 0;
const TYPE_COVER = 1;

class UserImage {
    constructor(file, type, user_id) {
        this.file = file;
        this.type = type;
        this.user_id = user_id;
    }

    get validTypes() {
        return ["image/gif", "image/png", "image/jpeg"];
    }

    validate() {
        if (this.validTypes.indexOf(this.file.mimetype) == -1) {
            return Promise.reject("Invalid image type. Allowed types are: GIF, PNG, JPEG");
        }
        return loadImage(this.file.data).then(image => {
            const dimensions = this.type == TYPE_AVATAR ? [80, 80] : [800, 300];
            if (image.width != dimensions[0] || image.height != dimensions[1])
                return Promise.reject(`Image dimensions should be ${dimensions[0]}x${dimensions[1]}`);
            return image;
        });
    }

    upload() {
        return new Promise((resolve, reject) => {
            let imageName = this.getImageName();
            this.file.mv(`${UPLOAD_PATH}/${imageName}`, err => {
                if (err) {
                    reject(err);
                }
                resolve(imageName);
            });
        });
    }

    getImageName() {
        let imageName = `${this.user_id}_`;
        if (this.type == TYPE_AVATAR) {
            imageName += 'avatar';
        } else {
            imageName += 'cover';
        }
        return imageName + "." + this.file.mimetype.split('/').slice(-1)[0];
    }

}

module.exports.UserImage = UserImage;
module.exports.TYPE_AVATAR = TYPE_AVATAR;
module.exports.TYPE_COVER = TYPE_COVER;
module.exports.UPLOAD_PATH = UPLOAD_PATH;