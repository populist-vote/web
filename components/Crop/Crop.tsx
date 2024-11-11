import React, { useState, useCallback } from "react";
import styles from "./Crop.module.scss";
import Cropper from "react-easy-crop";
import { Area, Point } from "react-easy-crop/types";
import { Modal } from "../Modal/Modal";
import { Button } from "components/Button/Button";
import { toast } from "react-toastify";

// Function to create image from source
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });

// Function to get cropped image
async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  // Set canvas size to the desired cropped area
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Draw the cropped image
  ctx.beginPath();
  ctx.arc(
    pixelCrop.width / 2,
    pixelCrop.height / 2,
    Math.min(pixelCrop.width, pixelCrop.height) / 2,
    0,
    2 * Math.PI
  );
  ctx.clip();

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          throw new Error("Canvas is empty");
        }
        resolve(blob);
      },
      "image/jpeg",
      0.95
    );
  });
}

interface ImageCropperProps {
  file: File;
  onCropComplete: (croppedImage: Blob) => void;
  onClose: () => void;
}

export const ImageCropper = ({
  file,
  onCropComplete,
  onClose,
}: ImageCropperProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);

  const onCropCompleteHandler = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedArea(croppedAreaPixels);
    },
    []
  );

  const handleSave = async () => {
    try {
      if (!croppedArea) return;
      const imageUrl = URL.createObjectURL(file);
      const croppedImageBlob = await getCroppedImg(imageUrl, croppedArea);
      onCropComplete(croppedImageBlob);
      onClose();
      setIsOpen(false);
    } catch (error) {
      toast.error(`Error cropping image: ${JSON.stringify(error)}`);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <h2 style={{ textAlign: "center" }}>Crop Image</h2>
      <div className={styles.cropContainer}>
        <div className={styles.cropArea}>
          <Cropper
            image={URL.createObjectURL(file)}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteHandler}
          />
        </div>
        <div className={styles.controls}>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className={styles.slider}
          />
        </div>
      </div>
      <div className={styles.centered}>
        <Button onClick={handleSave} label="Save" />
      </div>
    </Modal>
  );
};
