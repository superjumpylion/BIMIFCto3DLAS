

// Grant CesiumJS access to your ion assets
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjMTYwOTc1MS0zNDA2LTQ5Y2QtYTdjMy0zNjkzZjQzNTBhZWMiLCJpZCI6NDE0NDMsImlhdCI6MTYxMDEwMDQyOX0.YYBSYi5IIiOTPjf6F1zO7B2icPCbHeDs8AFwC4JHkC4";

var viewer = new Cesium.Viewer("cesiumContainer");




var tilesetbe = viewer.scene.primitives.add(
  new Cesium.Cesium3DTileset({
    url: 'tileset_be/tileset.json',
    allowPicking: true,
  })
);

var tileset = viewer.scene.primitives.add(
  new Cesium.Cesium3DTileset({
    url: 'tileset_ladm/tileset.json',
  })
);



var utrecht = Cesium.Cartesian3.fromDegrees(
    5.099889059987014,
    52.09117184705068,
    1000.0,
  );

tileset.readyPromise
  .then(function (tileset) {
    viewer.camera.flyTo({
      destination: utrecht,
    });

  })
  .otherwise(function (error) {
    console.log(error);
  });







// STYLING

tileset.style = new Cesium.Cesium3DTileStyle({
    color: {
      conditions: [
        [
          "${feature['la_buildingunit']} === 'DUMMY' ",
          "color('cyan', 0.9)",
        ],
        [true, "color('gold',0.6)"],
      ],
    },
  });

tilesetbe.style = new Cesium.Cesium3DTileStyle({
    color: {
      conditions: [
        [
          "${feature['la_buildingunit']} === 'DUMMY' ",
          "color('gold', 0.9)",
        ],
        [true, "color('white',0.3)"],
      ],
    },
  });



// STYLING HOVER


// HTML overlay for showing feature name on mouseover
var nameOverlay = document.createElement("div");
viewer.container.appendChild(nameOverlay);
nameOverlay.className = "backdrop";
nameOverlay.style.display = "none";
nameOverlay.style.position = "absolute";
nameOverlay.style.bottom = "0";
nameOverlay.style.left = "0";
nameOverlay.style["pointer-events"] = "none";
nameOverlay.style.padding = "4px";
nameOverlay.style.backgroundColor = "black";






// Information about the currently selected feature
var selected = {
  feature: undefined,
  originalColor: new Cesium.Color(),
};

// An entity object which will hold info about the currently selected feature for infobox display
var selectedEntity = new Cesium.Entity();

// Get default left click handler for when a feature is not picked on left click
var clickHandler = viewer.screenSpaceEventHandler.getInputAction(
  Cesium.ScreenSpaceEventType.LEFT_CLICK
);

// If silhouettes are supported, silhouette features in blue on mouse over and silhouette green on mouse click.
// If silhouettes are not supported, change the feature color to yellow on mouse over and green on mouse click.
if (
  Cesium.PostProcessStageLibrary.isSilhouetteSupported(viewer.scene)
) {
  // Silhouettes are not supported. Instead, change the feature color.

  // Information about the currently highlighted feature
  var highlighted = {
    feature: undefined,
    originalColor: new Cesium.Color(),
  };

  // Color a feature yellow on hover.
  viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(
    movement
  ) {
    // If a feature was previously highlighted, undo the highlight
    if (Cesium.defined(highlighted.feature)) {
      highlighted.feature.color = highlighted.originalColor;
      highlighted.feature = undefined;
    }
    // Pick a new feature
    var pickedFeature = viewer.scene.pick(movement.endPosition);
    if (!Cesium.defined(pickedFeature)) {
      nameOverlay.style.display = "none";
      return;
    }
    // A feature was picked, so show it's overlay content
    nameOverlay.style.display = "block";
    nameOverlay.style.bottom =
      viewer.canvas.clientHeight - movement.endPosition.y + "px";
    nameOverlay.style.left = movement.endPosition.x + "px";
    var name = pickedFeature.getProperty("name");
    if (!Cesium.defined(name)) {
      name = pickedFeature.getProperty("id");
    }
    nameOverlay.textContent = name;
    // Highlight the feature if it's not already selected.
    if (pickedFeature !== selected.feature) {
      highlighted.feature = pickedFeature;
      Cesium.Color.clone(
        pickedFeature.color,
        highlighted.originalColor
      );
      pickedFeature.color = Cesium.Color.FIREBRICK;
    }
  },
  Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  // Color a feature on selection and show metadata in the InfoBox.
  viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(
    movement
  ) {
    // If a feature was previously selected, undo the highlight
    if (Cesium.defined(selected.feature)) {
      selected.feature.color = selected.originalColor;
      selected.feature = undefined;
    }
    // Pick a new feature
    var pickedFeature = viewer.scene.pick(movement.position);
    if (!Cesium.defined(pickedFeature)) {
      clickHandler(movement);
      return;
    }
    // Select the feature if it's not already selected
    if (selected.feature === pickedFeature) {
      return;
    }
    selected.feature = pickedFeature;
    // Save the selected feature's original color
    if (pickedFeature === highlighted.feature) {
      Cesium.Color.clone(
        highlighted.originalColor,
        selected.originalColor
      );
      highlighted.feature = undefined;
    } else {
      Cesium.Color.clone(pickedFeature.color, selected.originalColor);
    }
    // Highlight newly selected feature
    pickedFeature.color = Cesium.Color.LIME;
    // Set feature infobox description
    var featureName = pickedFeature.getProperty("name");
    selectedEntity.name = featureName;
    selectedEntity.description =
      'Loading <div class="cesium-infoBox-loading"></div>';
    viewer.selectedEntity = selectedEntity;
    selectedEntity.description =
      '<table class="cesium-infoBox-defaultTable"><tbody>' +
      "<tr><th>LA_BuildingUnit</th><td>" +
      pickedFeature.getProperty("la_buildingunit") +
      "</td></tr>" +
      "<tr><th>LA_RRR</th><td>" +
      pickedFeature.getProperty("la_rrr") +
      "</td></tr>" +
      "<tr><th>LA_Party</th><td>" +
      pickedFeature.getProperty("la_party") +
      "</td></tr>" +
      "<tr><th>Party Name</th><td>" +
      pickedFeature.getProperty("party_name") +
      "</td></tr>" +
      "<tr><th>LA_LegalSpaceBuildingUnit</th><td>" +
      pickedFeature.getProperty("la_legalspacebuildingunit") +
      "</td></tr>" +
      "<tr><th>Space Name</th><td>" +
      pickedFeature.getProperty("space_longname") +
      "</td></tr>" +
      "</tbody></table>";
  },
  Cesium.ScreenSpaceEventType.LEFT_CLICK);
}
