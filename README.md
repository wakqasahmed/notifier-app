## Formatters

#### Direct Notification Formatter URI
https://ipfs.io/ipfs/bafkreihesmdzo7hxbottmzfsdre7hp5smqf5bmd7aa4qda43tay2njx2wi

#### Broadcast Notification Formatter URI
https://ipfs.io/ipfs/bafkreicbd3cprufiemcmwap2toed4ga6lq2zg3iwhvaarmx66jyyyxnyae


## How to Run Locally

Deployment steps (Remix + Ganache)

  1. MetaMask → Ganache

  In MetaMask, add a custom network:
  - RPC URL: http://127.0.0.1:7545 (Ganache GUI) or http://127.0.0.1:8545 (Ganache CLI)
  - Chain ID: Check what Ganache shows — usually 1337. Older GUI versions use 5777.
  - Currency: ETH

  Import a Ganache account into MetaMask using one of the private keys shown in Ganache.

  2. Deploy in Remix

  1. Open remix.ethereum.org
  2. Create two files under contracts/:
    - Paste contracts/remix/NotifierMultiFormatter.sol
    - Paste contracts/remix/UseCasesDemo.sol
  3. Compiler tab → set version to 0.8.20 → compile both
  4. Deploy tab → Environment: Injected Provider - MetaMask (this connects to Ganache)
  5. Deploy NotifierMultiFormatter first — copy its address
  6. Deploy UseCasesDemo — paste the NotifierMultiFormatter address as the constructor argument
  7. Copy both deployed addresses

  3. Set formatter URIs (EIP-7017 setup phase — one-time)

  In Remix, call these two functions on the deployed NotifierMultiFormatter:

  setDirectFormatterURI("https://ipfs.io/ipfs/bafkreihesmdzo7hxbottmzfsdre7hp5smqf5bmd7aa4qda43tay2nj
  x2wi")
  
  setBroadcastFormatterURI("https://ipfs.io/ipfs/bafkreicbd3cprufiemcmwap2toed4ga6lq2zg3iwhvaarmx66jy
  yyxnyae")

  This emits AttestDirectFormatter / AttestBroadcastFormatter — the UI listens for these events and
  caches the formatter JSON. Notifications that fire afterwards will use the cached template.

  4. Update .env

  REACT_APP_NOTIFIER_ADDRESS=<NotifierMultiFormatter address from Remix>
  REACT_APP_USECASES_ADDRESS=<UseCasesDemo address from Remix>

  5. Start the UI

  cd notifier-app
  npm start

  Connect MetaMask (already on Ganache). The header will show Ganache. Go to the Use Case Demos tab
  and trigger any event — you'll see the toast notification and it'll appear in the feed.

  ---
  Note on Ganache restarts: Every time Ganache resets, the chain state is wiped. You must redeploy
  both contracts and update .env again.