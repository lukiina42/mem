"use client";

import React, { SetStateAction } from "react";

interface MemTypeSwitchProps {
  isActive: boolean;
  memsType: "Following" | "Newest";
  handleMemsTypeChange: (type: "Following" | "Newest") => void;
  disabled?: boolean;
}

export default function MemType(props: MemTypeSwitchProps) {
  const { isActive, memsType, handleMemsTypeChange, disabled } = props;
  return (
    <div
      className={`relative group flex w-1/2 h-12 items-center justify-center font-bold text-lg ${
        disabled ? "text-gray-400" : "hover:cursor-pointer hover:bg-blue-300"
      }  ${isActive && !disabled && "bg-blue-200"} transition-all duration-150`}
      onClick={() => handleMemsTypeChange(memsType)}
    >
      {memsType}
      {disabled && memsType == "Following" && (
        <span className="tooltip group-hover:scale-100 ml-auto mr-auto top-full left-0 right-0 text-center origin-top">
          You are not following anyone!
        </span>
      )}
    </div>
  );
}
