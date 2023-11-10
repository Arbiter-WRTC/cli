import * as ui from "./ui.js";

export const errorHandler = (errorMessage: string) => {
  ui.error(`Error: ${errorMessage}`);

  process.exit();
};

export const deployErrorHandler = (errorMessage: string) => {
  ui.error(`Error: ${errorMessage}`);

  ui.display(
    "\nThere's an error during deployment. Please check your Arbiter configuration and try again." +
      "\nIf the error persists, please create an issue on the Arbiter Github repository."
  );
  process.exit();
};