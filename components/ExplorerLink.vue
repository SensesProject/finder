<template>
  <button class="btn" v-tooltip="'Open selected scenarios in IIASA Explorer'" @click="openExplorer"><i class="icon-export" /> Open in Explorer</button>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import { get } from 'lodash'

  const APP_NAME = 'IXSE_SENSES'
  const AUTH_API = 'https://data.fonfon.at/auth-server-api'

  const asJson = response => response.json()

  function login (username, password) {
    return fetch(`${AUTH_API}/config/v1/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password, application: APP_NAME })
    }).then(asJson)
  }

  function getAppConfig (authToken, appName) {
    return fetch(`${AUTH_API}/config/v1/applications/${appName}/config`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    }).then(asJson)
  }

  function createWorkspace (baseUrl, authToken, workspace) {
    return fetch(`${baseUrl}/workspaces`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(workspace)
    }).then(asJson)
  }

  const workspaceTemplate = {
    'name': 'Demo',
    'description': 'Demo workspace',
    'panels': [
      {
        'id': 1,
        'selection': null,
        'options': {
          'name': 'New panel',
          'description': '',
          'showAs': 'text',
          'size': 'half',
          'markdown': '# Demo workspace\n\nThis workspace is created for demo purposes.'
        }
      },
      {
        'id': 2,
        'selection': {
          'metadata': [],
          'models': [
            1
          ],
          'scenarios': [
            3,
            6
          ],
          'runs': [
            3,
            6
          ],
          'ranges': {
            'years': [
              2023,
              2076
            ]
          },
          'characteristics': {
            'parameters': [],
            'variables': [],
            'timeseries': [
              32
            ]
          },
          'regions': [
            0
          ],
          'units': [],
          'minMaxTimeseries': [
            32
          ],
          'scales': null
        },
        'options': {
          'name': 'Chart panel',
          'description': '',
          'showAs': 'chart-line',
          'size': 'half',
          'stackedCharts': false,
          'crossPanelLinking': [],
          'showSelectedOnly': null
        }
      }
    ],
    'publishType': 'UNLISTED',
    'hasPreview': true
  }

  export default {
    computed: {
      ...mapState({
        filter: state => get(state, 'filter.filter', []),
        statusData: state => get(state, 'data.status', 'ERROR'),
        statusAuth: state => get(state, 'auth.status', 'ERROR'),
        data: state => get(state, 'data.data', [])
      }),
      ...mapGetters([
        'result',
        'url'
      ])
    },
    methods: {
      openExplorer: function (event) {
        console.log(this.result)
        console.log(this.data)
        console.log(this.datum)
        console.log(workspaceTemplate)
        this.onCreate()
      },
      async onCreate () {
        const username = 'scenario-finder'
        const password = 'g2qo@mBB!uPXsmwVAzJ-'
        if (!username || !password) return
        const authToken = await login(username, password)
        // console.log({authToken})
        const config = await getAppConfig(authToken, APP_NAME)
        const baseUrl = config.find(e => e.path === 'baseUrl').value
        // console.log({config})
        const workspace = await createWorkspace(baseUrl, authToken, workspaceTemplate)
        // console.log({workspace})
        const shareUrl = `https://data.fonfon.at/scenario-explorer//#/workspaces/share/${workspace.accessToken}`
        if (confirm(`Open ${shareUrl}`)) {
          window.open(shareUrl, 'blank')
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/variables";

</style>
