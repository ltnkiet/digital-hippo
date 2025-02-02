import React, { memo } from "react";
import { CgSpinner } from "asset/icons";

const ButtonV2 = ({
  children,
  handleOnClick,
  style,
  bgColor,
  fw,
  type = "button",
  disabled,
}) => {
  return (
    <button
      type={type}
      className={
        style
          ? style
          : `px-4 py-2 rounded-xl text-white flex items-center justify-center ${
              bgColor ? bgColor : `bg-main`
            }  text-semibold my-2 ${fw ? "w-full" : "w-fit"}`
      }
      onClick={() => {
        handleOnClick && handleOnClick();
      }}>
      {disabled && (
        <span className="animate-spin">
          <CgSpinner size={18} />
        </span>
      )}
      {children}
    </button>
  );
};

export default memo(ButtonV2);
