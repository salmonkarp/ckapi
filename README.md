
# CKAPI | Cookies Kingdom API

An Express JS API for Cookies Kingdom's backend order management system. Involves CRUD operations for various collections inside a MongoDB database. Hosted on Vercel.


## API Reference

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `x-api-key` | `string` | **Required**. The API key |

### Product Methods

#### Get all products
```http
  GET /product
```

#### Get product by id
```http
  GET /product/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |


#### Create product

```http
  POST /product
```

#### Update product

```http
  PUT /product/${id}
```

#### Delete product

```http
  DELETE /product/${id}
```

### Product Model

Field        | Type    | Required | Default | Description |
-------------|---------|----------|---------| ----------- |
name         | String  | Yes      |         | Name of product
currentStock | Number  | No       | 0       | Current stock of product, automatically defaults to zero.
prices       | Mixed   | Yes      |         | JSON Object containing key-value pairs, where the key value must be a string and the value must be a Number.



#### the rest will be coming soon...
