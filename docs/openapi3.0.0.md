---
title: ONEm HTTP REST Specification API
language_tabs:
  - javascript: Javascript
  - python: Python
toc_footers: []
includes: []
search: false
highlight_theme: darkula
headingLevel: 2

---

<h1 id="onem-http-rest-specification-api">ONEm HTTP REST Specification API v1.1-oas3</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

This specification defines the HTTP REST interface that is used when applications receive callbacks to the URL specified in the service registration.

Base URLs:

* <a href="http://developer-onem.com">http://developer-onem.com</a>

* <a href="http://testtool.skor.games:9000">http://testtool.skor.games:9000</a>

Email: <a href="mailto:developer@onem.com">ONEm</a> 

# Authentication

- HTTP Authentication, scheme: bearer 

<h1 id="onem-http-rest-specification-api-default">Default</h1>

## register

<a id="opIdregister"></a>

> Code samples

```javascript
var headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'

};

$.ajax({
  url: 'http://developer-onem.com/service',
  method: 'post',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.post('http://developer-onem.com/service', params={

}, headers = headers)

print r.json()

```

`POST /service`

Register or re-register a service

> Body parameter

```json
{
  "apiKey": "gklgjiljwejfjoweWEWEOGJWEGW",
  "serviceName": "todo",
  "callbackPath": "http://myappsite.com",
  "verbs": [
    {
      "name": "menu",
      "route": "/todo",
      "footer": false
    }
  ]
}
```

<h3 id="register-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[body](#schemabody)|true|Provide the apikey given to you by your ONEm contact.  callbackPath is the base path of your host server where you want to receive callbacks arising from user inputs|

> Example responses

> 200 Response

```json
{
  "result": true
}
```

<h3 id="register-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Added or updated successfully|[inline_response_200](#schemainline_response_200)|

### Callbacks

<div class="content well">

#### userAction

**User action callback**

## register

> Code samples

```javascript
var headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'

};

$.ajax({
  url: 'http://developer-onem.com/service',
  method: 'post',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://developer-onem.com/service', params={

}, headers = headers)

print r.json()

```

`POST /service`

<h3 id="register-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|param1|query|string|false|The first optional space-separated parameter provided by the user in service switching events|
|param2|query|string|false|The second optional space-separated parameter provided by the user in service switching events|
|paramn|query|string|false|The nth optional space-separated parameter provided by the user in service switching events|

> Example responses

> 200 Response

```json
{
  "type": "menu",
  "header": "string",
  "footer": "string",
  "body": {
    "type": "menu",
    "header": "TODO MENU",
    "body": [
      {
        "type": "option",
        "description": "New todo",
        "nextRoute": "/todo/form/desc/"
      },
      {
        "type": "option",
        "description": "Done(0)",
        "nextRoute": "/todoListdone/"
      },
      {
        "type": "content",
        "description": "Todo (2):"
      },
      {
        "type": "option",
        "description": "Desc 234",
        "nextRoute": "/todo/view/5c9a505d37655e6c74c93f0d"
      },
      {
        "type": "option",
        "description": "Sdfg 123",
        "nextRoute": "/todo/view/5c9a5537ccafb76cc39b1a75"
      }
    ]
  }
}
```

<h3 id="register-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|JSON formatted object containing the response object that should be sent to the user (menu or form)|Inline|

<h3 id="register-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» type|string|true|none|Indicates whether to render a menu or a form|
|» header|string|false|none|The value of the header which will be prefixed automatically with and convered to upper case|
|» footer|string|false|none|The value of the footer if required if omitted the platform will include a default footer'|
|» body|any|true|none|Array of either content or menu objects|

*oneOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»» *anonymous*|[oneOf]|false|none|none|

*oneOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»» *anonymous*|object|false|none|Content only|
|»»»» type|string|true|none|none|
|»»»» description|string|true|none|Value to be rendered|

*xor*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»» *anonymous*|object|false|none|Menu option|
|»»»» type|string|true|none|none|
|»»»» description|string|true|none|Value to be rendered|
|»»»» nextRoute|string|true|none|relative URL from base path to use as callback when user chooses this option|
|»»»» method|string|false|none|HTTP method to use in callback|

*xor*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»» *anonymous*|[Form](#schemaform)|false|none|none|
|»»»» nextRoute|string|true|none|relative URL from base path to use as callback when user selects this option|
|»»»» method|string|false|none|HTTP method that should be used in the callback|
|»»»» confirm|boolean|false|none|TRUE if wizard confirmation menu should be displayed at the end of the form|
|»»»» formItems|[[Form_formItems](#schemaform_formitems)]|true|none|Array of form items|
|»»»»» name|string|true|none|Name of the form property|
|»»»»» description|string|true|none|User prompt|
|»»»»» type|string|true|none|Used for form property validation|

#### Enumerated Values

|Property|Value|
|---|---|
|type|menu|
|type|form|
|type|content|
|type|option|
|method|GET|
|method|POST|
|method|PUT|
|method|DELETE|
|method|GET|
|method|POST|
|method|PUT|
|method|DELETE|
|type|string|
|type|integer|
|type|date|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## register

> Code samples

```javascript
var headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'

};

$.ajax({
  url: 'http://developer-onem.com/service',
  method: 'post',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://developer-onem.com/service', params={

}, headers = headers)

print r.json()

```

`POST /service`

> Body parameter

```json
{
  "[object Object]": "dueDate"
}
```

<h3 id="register-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|false|When user completes a form, the body contains a json object with names properties and values.  The property names are taken from the 'name' property of the Form schema|
|» [object Object]|body|string|false|none|

> Example responses

> 200 Response

```json
{
  "type": "menu",
  "header": "string",
  "footer": "string",
  "body": {
    "type": "menu",
    "header": "TODO MENU",
    "body": [
      {
        "type": "option",
        "description": "New todo",
        "nextRoute": "/todo/form/desc/"
      },
      {
        "type": "option",
        "description": "Done(0)",
        "nextRoute": "/todoListdone/"
      },
      {
        "type": "content",
        "description": "Todo (2):"
      },
      {
        "type": "option",
        "description": "Desc 234",
        "nextRoute": "/todo/view/5c9a505d37655e6c74c93f0d"
      },
      {
        "type": "option",
        "description": "Sdfg 123",
        "nextRoute": "/todo/view/5c9a5537ccafb76cc39b1a75"
      }
    ]
  }
}
```

<h3 id="register-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|JSON formatted object containing the response object that should be sent to the user (menu or form)|Inline|

<h3 id="register-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» type|string|true|none|Indicates whether to render a menu or a form|
|» header|string|false|none|The value of the header which will be prefixed automatically with and convered to upper case|
|» footer|string|false|none|The value of the footer if required. If omitted the platform will include a default footer|
|» body|any|true|none|Array of either content or menu objects|

*oneOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»» *anonymous*|[oneOf]|false|none|none|

*oneOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»» *anonymous*|object|false|none|Content only|
|»»»» type|string|true|none|none|
|»»»» description|string|true|none|Value to be rendered|

*xor*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»» *anonymous*|object|false|none|Menu option|
|»»»» type|string|true|none|none|
|»»»» description|string|true|none|Value to be rendered|
|»»»» nextRoute|string|true|none|relative URL from base path to use as callback when user chooses this option|
|»»»» method|string|false|none|HTTP method to use in callback|

*xor*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»» *anonymous*|[Form](#schemaform)|false|none|none|
|»»»» nextRoute|string|true|none|relative URL from base path to use as callback when user selects this option|
|»»»» method|string|false|none|HTTP method that should be used in the callback|
|»»»» confirm|boolean|false|none|TRUE if wizard confirmation menu should be displayed at the end of the form|
|»»»» formItems|[[Form_formItems](#schemaform_formitems)]|true|none|Array of form items|
|»»»»» name|string|true|none|Name of the form property|
|»»»»» description|string|true|none|User prompt|
|»»»»» type|string|true|none|Used for form property validation|

#### Enumerated Values

|Property|Value|
|---|---|
|type|menu|
|type|form|
|type|content|
|type|option|
|method|GET|
|method|POST|
|method|PUT|
|method|DELETE|
|method|GET|
|method|POST|
|method|PUT|
|method|DELETE|
|type|string|
|type|integer|
|type|date|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

</div>

<aside class="success">
This operation does not require authentication
</aside>

# Schemas

<h2 id="tocSmenu">Menu</h2>

<a id="schemamenu"></a>

```yaml
type: menu
header: TODO MENU
body:
  - type: option
    description: New todo
    nextRoute: /todo/form/desc/
  - type: option
    description: Done(0)
    nextRoute: /todoListdone/
  - type: content
    description: 'Todo (2):'
  - type: option
    description: Desc 234
    nextRoute: /todo/view/5c9a505d37655e6c74c93f0d
  - type: option
    description: Sdfg 123
    nextRoute: /todo/view/5c9a5537ccafb76cc39b1a75

```

### Properties

*oneOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|object|false|none|Content only|
|» type|string|true|none|none|
|» description|string|true|none|Value to be rendered|

*xor*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|object|false|none|Menu option|
|» type|string|true|none|none|
|» description|string|true|none|Value to be rendered|
|» nextRoute|string|true|none|relative URL from base path to use as callback when user chooses this option|
|» method|string|false|none|HTTP method to use in callback|

#### Enumerated Values

|Property|Value|
|---|---|
|type|content|
|type|option|
|method|GET|
|method|POST|
|method|PUT|
|method|DELETE|

<h2 id="tocSform">Form</h2>

<a id="schemaform"></a>

```yaml
nextRoute: string
method: POST
confirm: false
formItems:
  type: form
  header: TODO MENU
  body:
    nextRoute: todoAddDesc
    method: POST
    items:
      - name: description
        description: Provide a description for the task
        type: string
      - name: dueDate
        description: Provide a due date
        type: date

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|nextRoute|string|true|none|relative URL from base path to use as callback when user selects this option|
|method|string|false|none|HTTP method that should be used in the callback|
|confirm|boolean|false|none|TRUE if wizard confirmation menu should be displayed at the end of the form|
|formItems|[[Form_formItems](#schemaform_formitems)]|true|none|Array of form items|

#### Enumerated Values

|Property|Value|
|---|---|
|method|GET|
|method|POST|
|method|PUT|
|method|DELETE|

<h2 id="tocSservice_verbs">service_verbs</h2>

<a id="schemaservice_verbs"></a>

```yaml
name: menu
route: /todo
footer: false

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|true|none|none|
|route|string|true|none|none|
|footer|boolean|false|none|indicates whether this verb should appear in footers|

<h2 id="tocSbody">body</h2>

<a id="schemabody"></a>

```yaml
apiKey: gklgjiljwejfjoweWEWEOGJWEGW
serviceName: todo
callbackPath: 'http://myappsite.com'
verbs:
  - name: menu
    route: /todo
    footer: false

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|apiKey|string|false|none|none|
|serviceName|string|false|none|none|
|callbackPath|string|false|none|none|
|verbs|[[service_verbs](#schemaservice_verbs)]|false|none|none|

<h2 id="tocSinline_response_200">inline_response_200</h2>

<a id="schemainline_response_200"></a>

```yaml
result: true

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|result|boolean|false|none|Indicates success or failure|

<h2 id="tocSform_formitems">Form_formItems</h2>

<a id="schemaform_formitems"></a>

```yaml
name: string
description: string
type: string

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|true|none|Name of the form property|
|description|string|true|none|User prompt|
|type|string|true|none|Used for form property validation|

#### Enumerated Values

|Property|Value|
|---|---|
|type|string|
|type|integer|
|type|date|

