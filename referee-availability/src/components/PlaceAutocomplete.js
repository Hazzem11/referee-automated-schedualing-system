import React, { useEffect, useRef, useState } from "react";

function loadGoogleMaps(apiKey) {
  if (!apiKey) return Promise.reject(new Error("Missing REACT_APP_GOOGLE_MAPS_API_KEY"));
  if (window.google?.maps?.places) return Promise.resolve();

  const existing = document.querySelector("script[data-google-maps='true']");
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load Google Maps")));
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.dataset.googleMaps = "true";
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      apiKey
    )}&libraries=places`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });
}

/**
 * Autocomplete text input backed by Google Places.
 *
 * onPick receives: { label, placeId, lat, lng }
 */
export default function PlaceAutocomplete({ value, onChange, onPick, placeholder }) {
  const inputRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let autocomplete;
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    loadGoogleMaps(apiKey)
      .then(() => {
        if (!inputRef.current) return;
        autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
          fields: ["place_id", "formatted_address", "geometry", "name"],
          types: ["geocode", "establishment"],
        });
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          const label =
            place.formatted_address || place.name || inputRef.current?.value || "";
          const placeId = place.place_id || "";
          const lat = place.geometry?.location?.lat?.();
          const lng = place.geometry?.location?.lng?.();
          if (onPick) onPick({ label, placeId, lat, lng });
        });
      })
      .catch((e) => setError(e.message));

    return () => {
      if (autocomplete) {
        // No explicit destroy in Places Autocomplete; GC after unmount.
      }
    };
  }, [onPick]);

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => {
          setError("");
          onChange(e.target.value);
        }}
        placeholder={placeholder}
      />
      {error ? (
        <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>
          Autocomplete disabled: {error}
        </div>
      ) : null}
    </div>
  );
}

