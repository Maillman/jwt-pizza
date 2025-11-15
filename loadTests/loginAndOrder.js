import { sleep, check, fail } from 'k6'
import http from 'k6/http'
import jsonpath from 'https://jslib.k6.io/jsonpath/1.0.2/index.js'

export const options = {
  cloud: {
    distribution: { 'amazon:us:ashburn': { loadZone: 'amazon:us:ashburn', percent: 100 } },
    apm: [],
  },
  thresholds: {},
  scenarios: {
    Login_Buy_then_Validate_a_Pizza: {
      executor: 'ramping-vus',
      gracefulStop: '30s',
      stages: [
        { target: 5, duration: '30s' },
        { target: 20, duration: '1m10s' },
        { target: 15, duration: '30s' },
        { target: 0, duration: '15s' },
      ],
      gracefulRampDown: '30s',
      exec: 'login_Buy_then_Validate_a_Pizza',
    },
  },
}

export function login_Buy_then_Validate_a_Pizza() {
  let response

  const vars = {}

  // login
  response = http.put(
    'https://pizza-service.melvinwhitaker.com/api/auth',
    '{"email":"d@jwt.com","password":"diner"}',
    {
      headers: {
        'sec-ch-ua-platform': '"Windows"',
        'sec-ch-ua': '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
        'Content-Type': 'application/json',
        'sec-ch-ua-mobile': '?0',
      },
    }
  )
  if (!check(response, { 'status equals 200': response => response.status.toString() === '200' })) {
    console.log(response.body);
    fail('Login was *not* 200');
  }

  vars['token'] = jsonpath.query(response.json(), '$.token')[0]

  sleep(3)

  // get menu
  response = http.get('https://pizza-service.melvinwhitaker.com/api/order/menu', {
    headers: {
      'sec-ch-ua-platform': '"Windows"',
      Authorization: `Bearer ${vars['token']}`,
      'sec-ch-ua': '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
      'Content-Type': 'application/json',
      'sec-ch-ua-mobile': '?0',
    },
  })

  // get franchise
  response = http.get(
    'https://pizza-service.melvinwhitaker.com/api/franchise?page=0&limit=20&name=*',
    {
      headers: {
        'sec-ch-ua-platform': '"Windows"',
        Authorization: `Bearer ${vars['token']}`,
        'sec-ch-ua': '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
        'Content-Type': 'application/json',
        'sec-ch-ua-mobile': '?0',
      },
    }
  )
  sleep(4)

  // me
  response = http.get('https://pizza-service.melvinwhitaker.com/api/user/me', {
    headers: {
      'sec-ch-ua-platform': '"Windows"',
      Authorization: `Bearer ${vars['token']}`,
      'sec-ch-ua': '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
      'Content-Type': 'application/json',
      'sec-ch-ua-mobile': '?0',
    },
  })
  sleep(2)

  // order
  response = http.post(
    'https://pizza-service.melvinwhitaker.com/api/order',
    '{"items":[{"menuId":1,"description":"Veggie","price":0.0038}],"storeId":"1","franchiseId":1}',
    {
      headers: {
        'sec-ch-ua-platform': '"Windows"',
        Authorization: `Bearer ${vars['token']}`,
        'sec-ch-ua': '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
        'Content-Type': 'application/json',
        'sec-ch-ua-mobile': '?0',
      },
    }
  )
  if (!check(response, { 'status equals 200': response => response.status.toString() === '200' })) {
    console.log(response.body);
    fail('Order was *not* 200');
  }

  vars['jwt'] = jsonpath.query(response.json(), '$.jwt')[0]

  sleep(8)

  // verify order
  response = http.post(
    'https://pizza-factory.cs329.click/api/order/verify',
    `{"jwt":"${vars['jwt']}"}`,
    {
      headers: {
        'sec-ch-ua-platform': '"Windows"',
        Authorization: `Bearer ${vars['token']}`,
        'sec-ch-ua': '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
        'Content-Type': 'application/json',
        'sec-ch-ua-mobile': '?0',
      },
    }
  )
  sleep(6)

  // logout
  response = http.del('https://pizza-service.melvinwhitaker.com/api/auth', null, {
    headers: {
      'sec-ch-ua-platform': '"Windows"',
      Authorization: `Bearer ${vars['token']}`,
      'sec-ch-ua': '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
      'Content-Type': 'application/json',
      'sec-ch-ua-mobile': '?0',
    },
  })
}