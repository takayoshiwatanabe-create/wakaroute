"use client";

import React, { useState, useRef, ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import { isRTL } from '@/i18n/utils'; // Import isRTL for layout adjustments
import { useLocale } from "next-intl";

interface InputAreaProps {
  onDecompose: (textInput: string, imageFile?: File) => void;
  isLoading: boolean;
}

// Basic components for now, replace with shadcn/ui later
const Textarea = ({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    className={`w-full p-3 mb-4 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 resize-none ${className}`}
    rows={5}
    {...props}
  />
);

const Button = ({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={`w-full p-3 rounded-md bg-blue-500 text-white font-bold text-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    {...props}
  />
);

const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`w-full p-3 mb-4 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 ${className}`}
    {...props}
  />
);

// Basic Label component
const Label = ({ htmlFor, className, children }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label htmlFor={htmlFor} className={`text-gray-900 dark:text-white text-base ${className}`}>
    {children}
  </label>
);

export function InputArea({ onDecompose, isLoading }: InputAreaProps) {
  const t = useTranslations("decompose");
  const locale = useLocale();
  const rtl = isRTL(locale); // Check if current locale is RTL
  const [textInput, setTextInput] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTextInput(e.target.value);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    } else {
      setImageFile(null);
    }
  };

  const handleSubmit = () => {
    if (textInput.trim() || imageFile) {
      onDecompose(textInput.trim(), imageFile || undefined);
    }
  };

  const handleClearImage = () => {
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input visually
    }
  };

  const isSubmitDisabled = isLoading || (!textInput.trim() && !imageFile);

  return (
    <div className="w-full max-w-xl p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <Textarea
        placeholder={t("input_placeholder")}
        value={textInput}
        onChange={handleTextChange}
        disabled={isLoading}
        style={{ direction: rtl ? 'rtl' : 'ltr' }} // Apply RTL direction to textarea
      />

      <div className={`flex items-center justify-between mb-4 ${rtl ? 'flex-row-reverse' : ''}`}>
        {/* The label for the file input should be associated with the hidden input */}
        <Label htmlFor="image-upload" className="text-gray-700 dark:text-gray-300 text-sm">
          {t("image_upload_label")}
        </Label>
        <Input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          className="hidden" // Hide default input
          disabled={isLoading}
        />
        {/* This button acts as a visual trigger for the hidden file input */}
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-auto px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          disabled={isLoading}
        >
          {t("select_image_button")}
        </Button>
      </div>

      {imageFile && (
        <div className={`flex items-center justify-between p-3 mb-4 bg-gray-100 dark:bg-gray-700 rounded-md ${rtl ? 'flex-row-reverse' : ''}`}>
          <span className="text-gray-800 dark:text-gray-200 text-sm truncate">
            {imageFile.name}
          </span>
          <button
            type="button"
            onClick={handleClearImage}
            className={`text-red-500 hover:text-red-600 text-sm ${rtl ? 'mr-4' : 'ml-4'}`}
            disabled={isLoading}
          >
            {t("clear_image_button")}
          </button>
        </div>
      )}

      <Button onClick={handleSubmit} disabled={isSubmitDisabled}>
        {isLoading ? t("decomposing_button") : t("decompose_button")}
      </Button>
    </div>
  );
}

