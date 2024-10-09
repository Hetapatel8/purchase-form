import React from "react";

const CustomClearIndicator = (props) => {
    const {
        innerProps: { ref, ...restInnerProps }
      } = props;
  return (
    <div {...restInnerProps} ref={ref} style={{cursor: 'pointer'}} className="px-1 mb-1">
      <svg
        width="9px"
        height="9px"
        viewBox="0 0 16 16"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"      >
        <path
          fill="#cccccc"
          d="M15.1 3.1l-2.2-2.2-4.9 5-4.9-5-2.2 2.2 5 4.9-5 4.9 2.2 2.2 4.9-5 4.9 5 2.2-2.2-5-4.9z"
        ></path>
      </svg>
    </div>
  );
};

export default CustomClearIndicator;
