import Experience from "../services/three-instance/Experience";

declare global {
  interface Window {
    experience: Experience;
  }
}
