/*******************************************************************
 * UTILITY FUNCTIONS
 * - scroll to BEGIN COLLECTION CONFIG to provide the config values
 ******************************************************************/
const fs = require("fs");
const dir = __dirname;
const dotenv = require("dotenv");
dotenv.config(); // setup dotenv

/**
 * Adds a rarity to the configuration. This is expected to correspond with a
 * directory containing the rarity for each defined layer.
 * (i.e. `input/Arms/rare/`)
 *
 * @param _id - id of the rarity
 * @param _from - number in the edition to start this rarity from
 * @param _to - number in the edition to generate this rarity to
 * @return a rarity object used to dynamically generate the NFTs
 */
const addRarity = (_id, _from, _to) => {
  const _rarityWeight = {
    value: _id,
    from: _from,
    to: _to,
    layerPercent: {},
  };
  return _rarityWeight;
};

// Get the name without last 4 characters -> slice .png from the name.
const cleanName = (_str) => {
  let name = _str.slice(0, -4);
  return name;
};

// Reads the filenames of a given folder and returns it with its name and path.
const getElements = (_path, _elementCount) => {
  return fs
    .readdirSync(_path)
    .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
    .map((i) => {
      return {
        id: _elementCount,
        name: cleanName(i),
        path: `${_path}/${i}`,
      };
    });
};

/**
 * Adds a layer to the configuration. The layer will hold information on all the
 * defined parts and where they should be rendered in the image.
 *
 * @param _id - id of the layer
 * @param _position - on which x/y value to render this part
 * @param _size - of the image
 * @return a layer object used to dynamically generate the NFTs
 */
const addLayer = (_id, _position, _size) => {
  if (!_id) {
    console.log("error adding layer, parameters id required");
    return null;
  }
  if (!_position) {
    _position = { x: 0, y: 0 };
  }
  if (!_size) {
    _size = { width: width, height: height };
  }
  // add two different dimension for elements:
  // - all elements with their path information
  // - only the ids mapped to their rarity
  let elements = [];
  let elementCount = 0;
  let elementIdsForRarity = {};
  rarityWeights.forEach((rarityWeight) => {
    // TODO: test if something like this is needed. (chris)
    // if (rarityWeight.from == 0 && rarityWeight.to == 0) {
    //   continue;
    // }
    let elementsForRarity = getElements(`${dir}/${_id}/${rarityWeight.value}`);

    elementIdsForRarity[rarityWeight.value] = [];
    elementsForRarity.forEach((_elementForRarity) => {
      _elementForRarity.id = `${editionDnaPrefix}${elementCount}`;
      elements.push(_elementForRarity);
      elementIdsForRarity[rarityWeight.value].push(_elementForRarity.id);
      elementCount++;
    });
    elements[rarityWeight.value] = elementsForRarity;
  });

  let elementsForLayer = {
    id: _id,
    position: _position,
    size: _size,
    elements,
    elementIdsForRarity,
  };
  return elementsForLayer;
};

/**
 * Adds layer-specific percentages to use one vs another rarity.
 *
 * @param _rarityId - the id of the rarity to specify
 * @param _layerId - the id of the layer to specify
 * @param _percentages - an object defining the rarities and the percentage with which a given rarity for this layer should be used
 */
const addRarityPercentForLayer = (_rarityId, _layerId, _percentages) => {
  // console.log("===", "addRarityPercentForLayer() called", "===");
  let _rarityFound = false;
  rarityWeights.forEach((_rarityWeight) => {
    if (_rarityWeight.value === _rarityId) {
      let _percentArray = [];
      for (let percentType in _percentages) {
        _percentArray.push({
          id: percentType,
          percent: _percentages[percentType],
        });
      }
      _rarityWeight.layerPercent[_layerId] = _percentArray;
      _rarityFound = true;
    }
  });
  if (!_rarityFound) {
    console.log(
      `rarity ${_rarityId} not found, failed to add percentage information`
    );
  }
};

/**************************************************************
 * BEGIN COLLECTION CONFIG
 *************************************************************/

// image width in pixels
const width = process.env.IMG_WIDTH_PIXELS;
// image height in pixels
const height = process.env.IMG_HEIGHT_PIXELS;
// description for NFT in metadata file
const description = process.env.APP_DESCRIPTION;
// base url in case no unique metadata file i.e IPFS
const baseImageUri = process.env.SERVER_URL;
// id for edition to start from
const startEditionFrom = process.env.EDITION_START_FROM;
// amount of NFTs to generate in edition
// TODO: do automatic checks based on all image files found on the max size that
// can be made, logging that out, and then erroring here if `EDITION_SIZE` is
// too high. (chris)
const editionSize = process.env.EDITION_SIZE;
// prefix to add to edition dna ids (to distinguish dna counts from different
// generation processes for the same collection)
const editionDnaPrefix = process.env.EDITION_DNA_PREFIX;

// Create required weights for each weight, call 'addRarity()' with the id and
// from which to which element this rarity should be applied.
let rarityWeights = [
  // https://www.nft-innovation.com/post/how-to-create-an-nft-collection-step-by-step
  // possible results that can be generated:
  // 4*2*2*2*2*4*4*5*2 = 10_240 NFT's
  // 2*2*2*2*2*2*2*2*2 = 10_240 NFT's
  //
  // how many images to make for the amount of NFT's I want generated:
  // (number of images)^x = total number of pieces , x = number of properties
  // TODO: add logic that automatically calculates this based on the count of
  // image files found within each folder and sub-folder. (chris)
  addRarity("original", 1, editionSize),
  addRarity("rare", 0, 0),
  addRarity("super_rare", 0, 0),
];

// List of all folder names (and other options if needed). This is used to loop
// through all names and performing the necessary actions on further down.
//
// TODO: do this automatically based on the existing folders. (chris)
const folders = [
  {
    name: "Background",
    addLayer: {
      position: { x: 0, y: 0 },
      size: { width: width, height: height },
    },
    // TODO: add logic that automatically calculates this based on the count of
    // image files found within each folder and sub-folder. (chris)
    rarityPercentages: {
      rarityId: "original",
      superRare: 0,
      rare: 0,
      original: 100,
    },
  },
  {
    name: "Base Torso",
    // TODO: see above TODO on the first `rarityPercentages`. (chris)
    rarityPercentages: {
      rarityId: "original",
      superRare: 0,
      rare: 0,
      original: 100,
    },
  },
  {
    name: "Base Head",
    // TODO: see above TODO on the first `rarityPercentages`. (chris)
    rarityPercentages: {
      rarityId: "original",
      superRare: 0,
      rare: 0,
      original: 100,
    },
  },
  {
    name: "Torso",
    // TODO: see above TODO on the first `rarityPercentages`. (chris)
    rarityPercentages: {
      rarityId: "original",
      superRare: 0,
      rare: 0,
      original: 100,
    },
  },
  {
    name: "Arms",
    // TODO: see above TODO on the first `rarityPercentages`. (chris)
    rarityPercentages: {
      rarityId: "original",
      superRare: 0,
      rare: 0,
      original: 100,
    },
  },
  {
    name: "Mouths",
    // TODO: see above TODO on the first `rarityPercentages`. (chris)
    rarityPercentages: {
      rarityId: "original",
      superRare: 0,
      rare: 0,
      original: 100,
    },
  },
  {
    name: "Eyes",
    // TODO: see above TODO on the first `rarityPercentages`. (chris)
    rarityPercentages: {
      rarityId: "original",
      superRare: 0,
      rare: 0,
      original: 100,
    },
  },
  {
    name: "Accessories",
    // TODO: see above TODO on the first `rarityPercentages`. (chris)
    rarityPercentages: {
      rarityId: "original",
      superRare: 25,
      rare: 25,
      original: 50,
    },
  },
  {
    name: "Noses",
    // TODO: see above TODO on the first `rarityPercentages`. (chris)
    rarityPercentages: {
      rarityId: "original",
      superRare: 0,
      rare: 0,
      original: 100,
    },
  },
];
// Create required layers for each layer, call 'addLayer()' with the id and
// optionally the positioning and size. The id would be the name of the folder
// in your input directory (e.g. 'ball' for `./input/ball/`).
//
// TODO: do this automatically based on the folders found. (chris)
const layers = folders.map((folder) => {
  return addLayer(
    folder.name,
    folder?.addLayer?.position,
    folder?.addLayer?.size
  );
});

// Provide any specific percentages that are required for a given layer and
// rarity level all provided options are used based on their percentage values
// to decide which layer to select from.
folders.forEach((folder) => {
  addRarityPercentForLayer(folder.rarityPercentages.rarityId, folder.name, {
    super_rare: folder.rarityPercentages.superRare,
    rare: folder.rarityPercentages.rare,
    original: folder.rarityPercentages.original,
  });
});

module.exports = {
  layers,
  width,
  height,
  description,
  baseImageUri,
  editionSize,
  startEditionFrom,
  rarityWeights,
};
