import React, { useCallback, useEffect, useState } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import userIconImg from "../img/UserIcon.png";

const UserLocation = ({ pos }) => {
  const [zoom, setZoom] = useState(19);

  const map = useMap();

  const onZoom = useCallback(() => {
    setZoom(map.getZoom());
  }, [map]);

  useEffect(() => {
    map.on("zoom", onZoom);
  }, [onZoom, map]);

  const userLocationIcon = new L.Icon({
    iconUrl: userIconImg,
    iconRetinaUrl: userIconImg,
    iconSize: [30, 43],
  });

  return zoom > 13 ? (
    <Marker
      eventHandlers={{
        click: () => {
          map.flyTo(pos, 19);
        },
      }}
      icon={userLocationIcon}
      position={pos}
    >
      <Popup>Your Location</Popup>
    </Marker>
  ) : (
    <></>
  );
};

export default UserLocation;
