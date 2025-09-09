import { memo } from "react";

export const ContextLayout = memo(() => {
  return (
    <div className="flex flex-col w-full">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Context Layout</h1>
      <p>This is where you can find all the information about your context.</p>
      {/* Additional content can be added here */}
    </div>
  );
});
ContextLayout.displayName = "ContextLayout";

export default ContextLayout;