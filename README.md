## Proposed API

# Initialization

```javascript
osdi.client('https://my-osdi-endpoint.com')
.then(client => {
  // use the client here
})
.catch(err => {
  // either the aep was formatted invalidly or there was a network error
})
```
