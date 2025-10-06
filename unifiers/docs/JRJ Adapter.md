# JRJ Bot Broker Adapter

## 1. Overview
The JRJ Bot Broker Adapter provides a unified interface for interacting with multiple brokerage platforms (e.g., Alpaca, Interactive Brokers, Binance, MetaTrader).
Its purpose is to normalize account, position, and order enabling the JRJ Account State, JRJ Bot Orchestration Layer to operate independently of broker-specific APIs.

## 2. Objectives
- Broker Agnostic: Enable JRJ bots to trade across brokers and asset classes with a single API interface.
- Normalized Schema: Standardize naming, field types, and event structures across stock, crypto, and forex brokers.
- Low Latency: Maintain sub-100ms average response latency for all state and order endpoints.
- Real-Time Updates: Push account and order updates as streaming events.
- Auditability: Provide a complete log of all broker communications for debugging and compliance.

## 3. Endpoint Specifications

### 1. /broker/account/raw
Purpose: Return raw, normalized broker-level account snapshot.

```
{
  "success": true,
  "timestamp": "2025-10-06T19:10:23Z",
  "data": {
    "account_id": "ACC-92837",
    "broker": "OANDA",
    "environment": "live",
    "equity": 158420.55,
    "cash": 78230.00,
    "buying_power": 310000.00,
    "margin_used": 80250.12,
    "base_currency": "USD",
    "asset_balances": {
      "USD": 78230.00,
      "BTC": 0.75,
      "ETH": 4.2,
      "EUR": 20000.00
    },
    "margin_ratio": 0.52,
    "leverage_allowed": 5,
    "unrealized_pnl": 1820.35,
    "realized_pnl": 7630.11,
    "open_positions": 9
  }
}
```

### 2. /broker/assets

**Purpose:**  
Return all tradable instruments or assets supported by the connected broker account.  
This endpoint provides metadata required to display available markets or validate symbols

**Schema**

| Field | Type | Description |
|--------|------|-------------|
| `symbol` | string | Normalized human-readable symbol (e.g., `AAPL`, `BTC/USD`, `EUR/USD`). |
| `asset_type` | string | Asset class: `stock`, `crypto`, `forex`, `futures`, etc. |
| `instrument_id` | string | Broker-specific unique identifier (e.g., IBKR `conId`, Binance `symbolId`, MT5 `ticket`). |
| `base_asset` | string _(optional)_ | Base asset for pairs (e.g., `BTC` in `BTC/USD`). |
| `quote_asset` | string _(optional)_ | Quote asset for pairs (e.g., `USD` in `BTC/USD`). |
| `exchange` | string _(optional)_ | Exchange or venue name (e.g., `NASDAQ`, `BINANCE`, `OANDA`). |
| `tick_size` | float | Minimum price increment. |
| `lot_size` | float | Minimum tradable unit. |
| `leverage_limit` | float | Maximum leverage allowed (e.g., 5 for 5×). |
| `shortable` | bool | Whether short selling is allowed. |
| `tradable` | bool | Whether the instrument is currently tradable. |
| `min_notional` | float _(optional)_ | Minimum trade value. |
| `contract_specs` | object _(optional)_ | For derivatives: `{ "expiry": "2025-12-20", "strike": null }`. |

#### Example: **Alpaca (Stocks)**

```json
{
  "success": true,
  "timestamp": "2025-10-06T18:30:00Z",
  "data": [
    {
      "symbol": "AAPL",
      "asset_type": "stock",
      "instrument_id": "AAPL",
      "exchange": "NASDAQ",
      "tick_size": 0.01,
      "lot_size": 1,
      "leverage_limit": 2,
      "shortable": true,
      "tradable": true
    },
    {
      "symbol": "TSLA",
      "asset_type": "stock",
      "instrument_id": "TSLA",
      "exchange": "NASDAQ",
      "tick_size": 0.01,
      "lot_size": 1,
      "leverage_limit": 2,
      "shortable": true,
      "tradable": true
    }
  ]
}
```

#### Example: **Interactive Brokers (IBKR)**
```json
{
  "success": true,
  "timestamp": "2025-10-06T18:30:00Z",
  "data": [
    {
      "symbol": "AAPL",
      "asset_type": "stock",
      "instrument_id": "265598",        // IB conId
      "exchange": "SMART",
      "tick_size": 0.01,
      "lot_size": 1,
      "leverage_limit": 2,
      "shortable": true,
      "tradable": true
    },
    {
      "symbol": "ESZ5",
      "asset_type": "futures",
      "instrument_id": "703534920",     // E-mini S&P 500 Dec 2025
      "exchange": "GLOBEX",
      "tick_size": 0.25,
      "lot_size": 1,
      "leverage_limit": 20,
      "shortable": false,
      "tradable": true,
      "contract_specs": { "expiry": "2025-12-19", "strike": null }
    }
  ]
}
```

#### Example: **MetaTrader (MT5)**
```json
{
  "success": true,
  "timestamp": "2025-10-06T18:30:00Z",
  "data": [
    {
      "symbol": "EUR/USD",
      "asset_type": "forex",
      "instrument_id": "EURUSD",
      "base_asset": "EUR",
      "quote_asset": "USD",
      "tick_size": 0.0001,
      "lot_size": 1000,
      "leverage_limit": 30,
      "shortable": true,
      "tradable": true
    },
    {
      "symbol": "XAU/USD",
      "asset_type": "forex",
      "instrument_id": "XAUUSD",
      "base_asset": "XAU",
      "quote_asset": "USD",
      "tick_size": 0.01,
      "lot_size": 100,
      "leverage_limit": 20,
      "shortable": true,
      "tradable": true
    }
  ]
}
```

#### Example: **Binance (Crypto)**
```json
{
  "success": true,
  "timestamp": "2025-10-06T18:30:00Z",
  "data": [
    {
      "symbol": "BTC/USD",
      "asset_type": "crypto",
      "instrument_id": "BTCUSDT",
      "base_asset": "BTC",
      "quote_asset": "USD",
      "exchange": "BINANCE",
      "tick_size": 0.1,
      "lot_size": 0.0001,
      "leverage_limit": 10,
      "shortable": true,
      "tradable": true,
      "min_notional": 10.0
    },
    {
      "symbol": "ETH/USD",
      "asset_type": "crypto",
      "instrument_id": "ETHUSDT",
      "base_asset": "ETH",
      "quote_asset": "USD",
      "exchange": "BINANCE",
      "tick_size": 0.1,
      "lot_size": 0.001,
      "leverage_limit": 5,
      "shortable": true,
      "tradable": true
    }
  ]
}
```

### 3. /broker/assets/find
Purposs: Find a tradable asset and return its unique broker identifier and metadata.
This is used when submitting an order — to resolve the broker’s instrument_id or contract from a user-provided symbol.

#### Example: Alpaca

Request
```json
{ "query": "AAPL" }
```

Response
```json
{
  "success": true,
  "data": {
    "symbol": "AAPL",
    "instrument_id": "AAPL",
    "asset_type": "stock",
    "exchange": "NASDAQ",
    "tick_size": 0.01,
    "lot_size": 1,
    "leverage_limit": 2,
    "tradable": true
  }
}
```

#### Example: IBKR

Request
```json
{ "query": "AAPL" }
```

Response
```json
{
  "success": true,
  "data": {
    "symbol": "AAPL",
    "instrument_id": "265598",      // IB conId
    "asset_type": "stock",
    "exchange": "SMART",
    "tick_size": 0.01,
    "lot_size": 1,
    "leverage_limit": 2,
    "tradable": true
  }
}
```

#### Example: MetaTrader (MT5)

Request
```json
{ "query": "EURUSD" }
```

Response
```json
{
  "success": true,
  "data": {
    "symbol": "EUR/USD",
    "instrument_id": "EURUSD",
    "asset_type": "forex",
    "exchange": "MT5",
    "tick_size": 0.0001,
    "lot_size": 1000,
    "leverage_limit": 30,
    "tradable": true
  }
}
```

#### Example: Binance

Request
```json
{ "query": "BTCUSDT" }
```

Response
```json
{
  "success": true,
  "data": {
    "symbol": "BTC/USD",
    "instrument_id": "BTCUSDT",
    "asset_type": "crypto",
    "exchange": "BINANCE",
    "tick_size": 0.1,
    "lot_size": 0.0001,
    "leverage_limit": 10,
    "tradable": true
  }
}
```

### 4. /broker/positions/raw

**Purpose:**  
Return raw broker-level open positions.  
This endpoint represents *atomic* position objects exactly as maintained by the broker — i.e., before aggregation into `/broker/portfolio`.

Each position line is uniquely identifiable via a **`broker_position_id`** (system-generated by the broker).  
Multiple positions may reference the same `instrument_id` if the broker supports **hedging mode** or multiple trades per symbol.


#### **Schema**

| Field | Type | Description |
|--------|------|-------------|
| `symbol` | string | Symbol or pair name (e.g., `AAPL`, `EUR/USD`, `BTC/USD`). |
| `instrument_id` | string _(optional)_ | Broker-specific unique instrument identifier (e.g., IBKR `conId`, Binance `symbolId`). |
| `broker_position_id` | string _(optional)_ | Broker-generated unique identifier for this specific open position or ticket. |
| `side` | string | `"long"` or `"short"`. |
| `quantity` | float | Quantity held in broker-native units (shares, lots, contracts, coins). |
| `entry_price` | float | Price at which this position was opened. |
| `market_price` | float | Latest market price. |
| `unrealized_pnl` | float | Profit/loss not yet realized. |
| `financing_fee` | float | Time-based holding cost or credit (swap / funding / interest). |
| `margin_requirement` | float | Portion of position value required as margin (e.g., 0.05 = 5%). |

---

#### Example: **Alpaca (Netting Model — 1 position per symbol)**

```json
{
  "success": true,
  "timestamp": "2025-10-06T19:10:23Z",
  "data": [
    {
      "symbol": "AAPL",
      "instrument_id": "AAPL",
      "broker_position_id": "POS-1-AAPL",
      "side": "long",
      "quantity": 120,
      "entry_price": 175.45,
      "market_price": 183.60,
      "unrealized_pnl": 984.00,
      "financing_fee": 0.0,
      "margin_requirement": 0.25
    }
  ]
}
```
Notes:

- Alpaca aggregates all trades in a symbol into one net position. So the portfolio and positions are the same.
- The broker_position_id is stable per symbol.
- No duplicate instrument_id entries exist.

#### Interactive Brokers (Contract-Based)

```json
{
  "success": true,
  "timestamp": "2025-10-06T19:10:23Z",
  "data": [
    {
      "symbol": "AAPL",
      "instrument_id": "265598",             // IB conId
      "broker_position_id": "P1234567",
      "side": "long",
      "quantity": 100,
      "entry_price": 175.45,
      "market_price": 183.60,
      "unrealized_pnl": 815.00,
      "financing_fee": 0.0,
      "margin_requirement": 0.5
    },
    {
      "symbol": "AAPL",
      "instrument_id": "265598",             // Same conId (same instrument)
      "broker_position_id": "P1234568",      // Different ticket (different trade)
      "side": "long",
      "quantity": 20,
      "entry_price": 176.00,
      "market_price": 183.60,
      "unrealized_pnl": 152.00,
      "financing_fee": 0.0,
      "margin_requirement": 0.5
    },
    {
      "symbol": "ESZ5",
      "instrument_id": "703534920",          // E-mini S&P 500 Dec 2025
      "broker_position_id": "P2233445",
      "side": "short",
      "quantity": 1,
      "entry_price": 4820.00,
      "market_price": 4825.00,
      "unrealized_pnl": -250.00,
      "financing_fee": 0.0,
      "margin_requirement": 0.1
    }
  ]
}
```

Notes:
- IBKR exposes one line per contract and trade.
- instrument_id identifies the contract (conId), but broker_position_id is unique per open trade.
- The same instrument_id can appear multiple times if there are multiple trades in the same instrument.


#### Example MetaTrader (MT5 — Hedging Mode)
```json
{
  "success": true,
  "timestamp": "2025-10-06T19:10:23Z",
  "data": [
    {
      "symbol": "EUR/USD",
      "instrument_id": "EURUSD",
      "broker_position_id": "TCK2391",
      "side": "long",
      "quantity": 50000,
      "entry_price": 1.0740,
      "market_price": 1.0792,
      "unrealized_pnl": 260.00,
      "financing_fee": -1.62,
      "margin_requirement": 0.05
    },
    {
      "symbol": "EUR/USD",
      "instrument_id": "EURUSD",
      "broker_position_id": "TCK2392",
      "side": "long",
      "quantity": 50000,
      "entry_price": 1.0755,
      "market_price": 1.0792,
      "unrealized_pnl": 185.00,
      "financing_fee": -1.63,
      "margin_requirement": 0.05
    },
    {
      "symbol": "GBP/USD",
      "instrument_id": "GBPUSD",
      "broker_position_id": "TCK2401",
      "side": "short",
      "quantity": 100000,
      "entry_price": 1.2580,
      "market_price": 1.2550,
      "unrealized_pnl": 300.00,
      "financing_fee": -2.10,
      "margin_requirement": 0.05
    }
  ]
}
```

Notes:

- MT5 supports hedging mode, so multiple open tickets can exist per symbol.
- Each broker_position_id (ticket) represents one independent trade.
- instrument_id (e.g., "EURUSD") repeats for all positions in the same pair.

#### Binance (Crypto Futures)

```json
{
  "success": true,
  "timestamp": "2025-10-06T19:10:23Z",
  "data": [
    {
      "symbol": "BTC/USD",
      "instrument_id": "BTCUSDT",
      "broker_position_id": "FUT-001",
      "side": "long",
      "quantity": 0.25,
      "entry_price": 60000.00,
      "market_price": 61200.00,
      "unrealized_pnl": 300.00,
      "financing_fee": -0.75,
      "margin_requirement": 0.2
    },
    {
      "symbol": "BTC/USD",
      "instrument_id": "BTCUSDT",
      "broker_position_id": "FUT-002",
      "side": "long",
      "quantity": 0.50,
      "entry_price": 58500.00,
      "market_price": 61200.00,
      "unrealized_pnl": 1350.00,
      "financing_fee": -1.25,
      "margin_requirement": 0.2
    },
    {
      "symbol": "ETH/USD",
      "instrument_id": "ETHUSDT",
      "broker_position_id": "FUT-101",
      "side": "short",
      "quantity": 2.0,
      "entry_price": 2250.00,
      "market_price": 2265.00,
      "unrealized_pnl": -30.00,
      "financing_fee": -0.10,
      "margin_requirement": 0.2
    }
  ]
}
```

Notes:

- Binance Futures allows multiple positions per instrument if multiple entries occur.
- Each broker_position_id is system-generated (e.g., "FUT-001", "FUT-002").
- instrument_id identifies the market pair (BTCUSDT, ETHUSDT) — not the trade itself.


### 5. /broker/portfolio

**Purpose:**
Unified normalized portfolio across all asset types.
Represents current open exposures, aggregated per symbol (or per instrument when required by broker).

---

**Schema**

| Field | Type | Description |
|--------|------|-------------|
| `symbol` | string | Normalized trading symbol (e.g., `AAPL`, `BTC/USD`, `EUR/USD`). |
| `asset_type` | string | Asset class: `stock`, `crypto`, `forex`, etc. |
| `instrument_id` | string _(optional)_ | Broker-specific unique identifier (e.g., IBKR `conId`, MT5 `ticket`, Binance `symbolId`). |
| `units` | float | Quantity held (shares, lots, coins, etc.). |
| `avg_entry_price` | float | Weighted average cost basis of the current open position. |
| `current_price` | float | Latest market price. |
| `market_value` | float | Current market value of the position. |
| `unrealized_pnl` | float | Profit/loss not yet realized. |
| `direction` | string | `"long"` or `"short"`. |
| `margin_requirement` | float | Fraction of position value required as margin (e.g., `0.2` = 20%). |

---

**Example: **Alpaca (US Stock Broker)**

```json
{
  "success": true,
  "timestamp": "2025-10-06T19:10:23Z",
  "data": [
    {
      "symbol": "AAPL",
      "instrument_id": "AAPL",
      "asset_type": "stock",
      "units": 120,
      "avg_entry_price": 175.45,
      "current_price": 183.60,
      "market_value": 22032.00,
      "unrealized_pnl": 984.00,
      "direction": "long",
      "margin_requirement": 0.5
    },
    {
      "symbol": "TSLA",
      "instrument_id": "TSLA",
      "asset_type": "stock",
      "units": -50,
      "avg_entry_price": 260.10,
      "current_price": 255.50,
      "market_value": -12775.00,
      "unrealized_pnl": 230.00,
      "direction": "short",
      "margin_requirement": 0.5
    }
  ]
}
```

Notes:
- Alpaca aggregates positions per symbol automatically.

**Example: Interactive Brokers (IBKR — Contract-Based)**

```json
{
  "success": true,
  "timestamp": "2025-10-06T19:10:23Z",
  "data": [
    {
      "symbol": "AAPL",
      "asset_type": "stock",
      "instrument_id": "265598",             // IBKR conId
      "units": 120,
      "avg_entry_price": 175.45,
      "current_price": 183.60,
      "market_value": 22032.00,
      "unrealized_pnl": 984.00,
      "direction": "long",
      "margin_requirement": 0.5
    },
    {
      "symbol": "ESZ5",
      "asset_type": "futures",
      "instrument_id": "703534920",          // IBKR conId for Dec 2025 E-mini S&P
      "units": 2,
      "avg_entry_price": 4800.00,
      "current_price": 4825.00,
      "market_value": 96500.00,
      "unrealized_pnl": 2500.00,
      "direction": "long",
      "margin_requirement": 0.1
    }
  ]
}
```
Notes:
- IBKR’s API reports positions per contract, not per symbol.
- instrument_id (conId) must be included to allow order routing and reconciliation.
- This will be generaged from postion endpoint by aggregating over instrument_id

**Example: MetaTrader (MT5 — Forex)**
```json
{
  "success": true,
  "timestamp": "2025-10-06T19:10:23Z",
  "data": [
    {
      "symbol": "EUR/USD",
      "asset_type": "forex",
      "instrument_id": "TCK2391",           // MT5 trade ticket (optional)
      "units": 100000,                      // 1 standard lot
      "avg_entry_price": 1.0740,
      "current_price": 1.0792,
      "market_value": 107920.00,
      "unrealized_pnl": 520.00,
      "direction": "long",
      "margin_requirement": 0.05
    },
    {
      "symbol": "GBP/USD",
      "asset_type": "forex",
      "instrument_id": "TCK2402",
      "units": 50000,                       // 0.5 lot
      "avg_entry_price": 1.2570,
      "current_price": 1.2555,
      "market_value": 62775.00,
      "unrealized_pnl": -75.00,
      "direction": "short",
      "margin_requirement": 0.05
    }
  ]
}
```

Notes:
- MT5 can be in hedging mode (multiple tickets per symbol) or netting mode (aggregated).
- The adapter aggregates per symbol but can retain the representative instrument_id for traceability.
- This will be generaged from postion endpoint by aggregating over instrument_id

**Example: Binance (Crypto Spot / Futures)**
```json
{
  "success": true,
  "timestamp": "2025-10-06T19:10:23Z",
  "data": [
    {
      "symbol": "BTC/USD",
      "asset_type": "crypto",
      "instrument_id": "BTCUSDT",           // Binance symbol ID
      "units": 0.75,
      "avg_entry_price": 58000.00,
      "current_price": 61200.00,
      "market_value": 45900.00,
      "unrealized_pnl": 2400.00,
      "direction": "long",
      "margin_requirement": 0.2
    },
    {
      "symbol": "ETH/USD",
      "asset_type": "crypto",
      "instrument_id": "ETHUSDT",
      "units": 4.2,
      "avg_entry_price": 2200.00,
      "current_price": 2265.00,
      "market_value": 9513.00,
      "unrealized_pnl": 273.00,
      "direction": "long",
      "margin_requirement": 0.2
    }
  ]
}
Notes:
- instrument_id reflects the internal Binance symbol (e.g., "BTCUSDT").
- Margin requirement shown only if margin/futures mode; in spot mode, may be 0.0.
- This will be generaged from postion endpoint by aggregating over instrument_id
```

### 6. /orders/submit

**Purpose:**
Create a new order through the broker adapter.

**Inputs**
| Field | Type | Description |
|--------|------|-------------|
| `symbol` | string | Trading symbol (e.g., `AAPL`, `BTC/USD`). |
| `instrument_id` | string _(optional)_ | Broker-specific instrument ID (if required). |
| `side` | string | `buy`, `sell`, `short`, or `cover`. |
| `quantity` | float | Order size in native units. |
| `order_type` | string | `market`, `limit`, `stop`, `bracket`. |
| `price` | float _(optional)_ | Limit/stop price. |
| `time_in_force` | string | `day`, `gtc`, `ioc`, `fok`. |
| `client_order_id` | string _(optional)_ | Client-assigned unique ID. |

**Response**
```json
{
  "success": true,
  "timestamp": "2025-10-06T19:20:00Z",
  "data": {
    "client_order_id": "JRJ-001-AAPL",
    "broker_order_id": "ALP-9485723",
    "status": "submitted",
    "ack_time": "2025-10-06T19:20:01Z"
  }
}
```

### 7. /orders/status

Purpose: Get current status of one or many orders.

Inputs: order_id or client_order_id

Response

```json
{
  "success": true,
  "data": {
    "client_order_id": "JRJ-001-AAPL",
    "broker_order_id": "ALP-9485723",
    "symbol": "AAPL",
    "status": "partially_filled",
    "filled_qty": 50,
    "remaining_qty": 70,
    "avg_fill_price": 183.50,
    "created_at": "2025-10-06T19:20:01Z",
    "updated_at": "2025-10-06T19:21:45Z"
  }
}
```

### 8. /orders/open
Purpose: List all currently active orders.

Response

```json
{
  "success": true,
  "data": [
    {
      "symbol": "AAPL",
      "order_type": "limit",
      "side": "buy",
      "quantity": 100,
      "price": 183.00,
      "status": "pending",
      "time_in_force": "day",
      "created_at": "2025-10-06T19:20:00Z"
    },
    {
      "symbol": "BTC/USD",
      "order_type": "stop",
      "side": "sell",
      "quantity": 0.5,
      "price": 60000.00,
      "status": "pending",
      "time_in_force": "gtc",
      "created_at": "2025-10-06T19:21:10Z"
    }
  ]
}
```


### 9. /orders/cancel
Purpose: Cancel a single open order.
Inputs: order_id (or client_order_id)

Response

```json
{
  "success": true,
  "data": {
    "client_order_id": "JRJ-001-AAPL",
    "broker_order_id": "ALP-9485723",
    "status": "cancelled",
    "cancel_time": "2025-10-06T19:23:11Z"
  }
}
```

### 10. /orders/history

Purpose: Retrieve filled, cancelled, or rejected orders.

Inputs: symbol, start_date, end_date, status (optional).

Response
```json
{
  "success": true,
  "data": [
    {
      "symbol": "AAPL",
      "side": "buy",
      "order_type": "limit",
      "filled_qty": 100,
      "avg_fill_price": 183.40,
      "submitted_at": "2025-10-05T19:00:00Z",
      "filled_at": "2025-10-05T19:02:10Z",
      "execution_venue": "NASDAQ",
      "pnl": 250.00,
      "latency_ms": 210
    },
    {
      "symbol": "BTC/USD",
      "side": "sell",
      "order_type": "market",
      "filled_qty": 0.75,
      "avg_fill_price": 61200.00,
      "submitted_at": "2025-10-06T18:10:00Z",
      "filled_at": "2025-10-06T18:10:02Z",
      "execution_venue": "BINANCE",
      "pnl": 2400.00,
      "latency_ms": 75
    }
  ]
}
```

### 11 /broker/audit

Purpose: Return internal adapter logs for transparency and troubleshooting.

### 12  /broker/health

Purpose: Provide system connectivity and latency diagnostics.