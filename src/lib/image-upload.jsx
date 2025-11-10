"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { toast } from "react-toastify";
import { X, ImageIcon, Loader2 } from "lucide-react";
import uploadImageToCloudinary from "@/lib/uploadImageToCloudinary";

export default function ImageUpload({
  onImageUploaded,
  currentImage,
  onImageRemoved,
  title = "Image *",
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(currentImage || "");
  const fileInputRef = useRef(null);

  // Sync imagePreview with currentImage prop changes
  useEffect(() => {
    setImagePreview(currentImage || "");
  }, [currentImage]);

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    setIsUploading(true);
    try {
      const result = await uploadImageToCloudinary(file);
      if (result?.url) {
        setImagePreview(result.url);
        onImageUploaded(result.url);
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Failed to upload image. Please try again.");
        setImagePreview(currentImage || "");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image. Please try again.");
      setImagePreview(currentImage || "");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    if (onImageRemoved) {
      onImageRemoved();
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">{title}</Label>

      {!imagePreview ? (
        <div
          className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer group rounded-lg"
          onClick={handleUploadClick}
        >
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-gray-200 transition-colors">
              {isUploading ? (
                <Loader2 className="h-6 w-6 text-gray-500 animate-spin" />
              ) : (
                <ImageIcon className="h-6 w-6 text-gray-500" />
              )}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">
                {isUploading ? "Uploading..." : "Click to upload image"}
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isUploading}
              className="hidden"
            />
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-lg border border-gray-200">
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 z-10 h-8 w-8 p-0 rounded-full shadow-lg"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="relative w-full h-48 md:h-64">
            <Image
              src={imagePreview || "/placeholder.svg"}
              alt="Preview"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
              className="rounded-lg"
              onError={() => {
                console.error("Failed to load image:", imagePreview);
                setImagePreview("");
              }}
              unoptimized
            />
          </div>
        </div>
      )}

      {isUploading && (
        <div className="flex items-center justify-center py-2">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span className="text-sm text-gray-600">Uploading image...</span>
        </div>
      )}
    </div>
  );
}
