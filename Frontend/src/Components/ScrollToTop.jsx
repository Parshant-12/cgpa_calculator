import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scrolls to the top left of the page smoothly
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" // Use "smooth" if you want a sliding effect, but "instant" feels more like a real page load
    });
  }, [pathname]);

  return null; // This component doesn't render any UI
}