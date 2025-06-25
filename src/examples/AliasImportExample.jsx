// filepath: src/examples/AliasImportExample.jsx
import React from "react";
import { FEATURES } from "@@/configs/EnvConfig";
import Button from "@@/components/ui/Button";

/**
 * Example component showing how to use path aliases
 */
const AliasImportExample = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Path Alias Import Example</h2>
      <p className="mb-2">
        Google Login Enabled: {FEATURES.googleLogin ? "Yes" : "No"}
      </p>
      <Button>This Button was imported using path alias</Button>
    </div>
  );
};

export default AliasImportExample;
