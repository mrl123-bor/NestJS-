import { ImageService } from './image.service';
import { Response } from 'express';
export declare class ImageController {
    private readonly imageService;
    constructor(imageService: ImageService);
    getImage(res: Response): Promise<void>;
}
