//Handle Imports

import React, { useState, useEffect } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import CustomModal from "./CustomModal2";
import Button from "react-bootstrap/Button";
import L from "leaflet";

// points and searchResult are the two props passed from Map.js
const PointsCluster = ({ points, searchResult }) => {
  const map = useMap();

  // modalId needs to be unique to stop every modal rendering at once
  const [modalId, setModalId] = useState(null);

  console.log("Modal Id", modalId);

  const handleClose = () => {
    setModalId(null);
  };

  const clusterIcon = (cluster) => {
    console.log("Cluster", cluster);
    let markers = cluster.getChildCount();
    console.log("Markers", markers);
    return new L.DivIcon({
      html: "<div><span>" + markers.length + "</span></div>",
      className: "marker-cluster",
      iconSize: new L.Point(40, 40),
    });
  };

  return (
    <MarkerClusterGroup
      showCoverageOnHover={true}
      disableClusteringAtZoom={18}
      spiderfyOnMaxZoom={false}
      maxClusterRadius={45}
      defaultIconCreateFunction={(cluster) => clusterIcon(cluster)}
    >
      {points.map((point) => {
        return (
          <Marker
            key={point.properties.placeId}
            className="marker"
            position={[
              point.geometry.coordinates[1],
              point.geometry.coordinates[0],
            ]}
            eventHandlers={{
              click: () => {
                map.flyTo([
                  point.geometry.coordinates[1],
                  point.geometry.coordinates[0],
                ]);
              },
            }}
          >
            <Popup
              onOpen={() => {
                console.log("opened popup");
              }}
              onClose={() => {
                console.log("closed popup");
              }}
            >
              <h4>{point.properties.placeName || "No Name Found"}</h4>
              <p>{point.properties.placeId}</p>
              <Button
                onClick={() => {
                  setModalId(point.properties.placeId);
                }}
              >
                Click the button
              </Button>

              {modalId === point.properties.placeId && (
                <CustomModal show={modalId !== null} onHide={handleClose} />
              )}
            </Popup>
          </Marker>
        );
      })}
    </MarkerClusterGroup>
  );
};

export default PointsCluster;
