# Moralis Mutants NFT Collection | Generative Art Engine

🧟‍♀️🧟‍♂️ Welcome to Rekt City on behalf of its horribly mutated survivors. 🧟‍♀️🧟‍♂️

## About

Aim: Save time and resources for artists and developers by allowing them to
generate and host NFT art, across blockchains, in one place (utilizing Moralis).

### These tutorial videos are a great introduction.

- Part 1: [Link to Moralis YouTube Video](https://youtu.be/KBV4FrCv4ps)
- Part 2: [Link to Moralis YouTube Video](https://youtu.be/FcH7qXnOgzs)

## Quick Launch 🚀

1. Via terminal, navigate to root directory:

   ```sh
   npm install
   ```

2. Go to [Moralis.io](https://moralis.io/) to create your server instance.

   **NOTE:** I recommend creating a `Testnet` server instance if this is for
   local test purposes, and then creating a `Mainnet` server instance once
   you're ready for public/production purposes.

3. Duplicate file `.env-example` to `.env` and add your Moralis server
   credentials _(available from previous step)_.

   **Note:** To find your xAPI key: https://deep-index.moralis.io/api-docs/#/storage/uploadFolder

4. Create your layered artwork in Adobe Photoshop _(or other)_ and split into
   folders in `./input/**` and configure your collection to match your layer
   structure and preferences accordingly by editing `./input/config.js`.

5. Finally, via terminal in the project directory run:

   ```sh
   npm run generate
   ```

   This injects the mutagen that will bring your Moralis mutants **ALIVE!**

## Minting ⛓

Copy Solidity contract to [⚙️ Remix IDE](https://remix.ethereum.org/) for test
and deployment, but first edit code to point to your meta data's IPFS folder
`'metahash/CID'`. You can get this, saved in dashboard of your Moralis server
instance in row of `'metahash'` column:

```javascript
    // ...commented out for brevity...
    constructor()
        ERC1155(
            "ipfs://INSERT_YOUR_CID_METAHASH/metadata/{id}.json"
        )
    {
        // ...commented out for brevity...
```

## Dependencies 🏗

- `moralis`: [ℹ️ Docs](https://docs.moralis.io/)
- `canvas`: [ℹ️ Docs](https://www.npmjs.com/package/canvas)

## TODOs ✅

- [x] NFT contract allowing tokens to be minted and transferred for Opensea.
- [ ] Users can mint NFT collection via custom dapp frontend.
- [ ] Compatibility across-chains (SOL/MATIC).
- [ ] Much more TBA.

## Community BUIDLing 👨‍🔧👩‍🔧

- [Moralis Forum](https://forum.moralis.io/)
- [Moralis Discord](https://discord.com/channels/819584798443569182)
- [Moralis GitHub](https://github.com/MoralisWeb3)
- [Moralis YouTube](https://www.youtube.com/channel/UCgWS9Q3P5AxCWyQLT2kQhBw)
