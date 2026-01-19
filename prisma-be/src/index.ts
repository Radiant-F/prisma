/**
 * App composition and type export
 * This file is used for type inference with Eden Treaty
 */
import app from "./app";

export type App = typeof app;
export { app };
