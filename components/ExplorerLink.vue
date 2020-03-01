<template>
  <button class="btn" v-tooltip="'Open selected scenarios in IIASA Explorer'" @click="openExplorer"><i class="icon-export" /> Open in Explorer</button>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import { get, map, compact } from 'lodash'

  const APP_NAME = 'IXSE_TEST_PUBLIC'
  const AUTH_API = 'https://db1.ene.iiasa.ac.at/EneAuth'

  const asJson = response => response.json()

  function login (username, password) {
    return fetch(`${AUTH_API}/config/v1/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username, password, application: APP_NAME})
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

  function generateTemplate (url, runs) {
    return {
      'name': 'Senses Scenario Finder Workspace',
      'description': 'Workspace created by the Senses Scenario Finder selection',
      'panels': [
        {
          'id': 1,
          'selection': null,
          'options': {
            'name': 'Introduction',
            'description': '',
            'showAs': 'text',
            'size': 'half',
            'markdown': `# Senses Scenario Finder workspace\n\nFind the selection of scenarios at [${url}](${url})`
          }
        },
        {
          'id': 2,
          'selection': {
            'metadata': [],
            'runs': runs,
            'ranges': {
              'years': [2023, 2076]
            },
            'characteristics': {
              'parameters': [],
              'variables': [],
              'timeseries': [1]
            },
            'regions': [0],
            'units': [],
            'minMaxTimeseries': [1],
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
        this.onCreate()
      },
      async onCreate () {
        console.log(this.result)
        const runs = compact(map(this.result, run => {
          return get(run, ['run-id', 'values'], false)
        }))
        if (runs.length) {
          console.log({ runs })
          const username = 'scenario-finder'
          const password = 'g2qo@mBB!uPXsmwVAzJ-'
          if (!username || !password) return
          const authToken = await login(username, password)
          const config = await getAppConfig(authToken, APP_NAME)
          const baseUrl = config.find(e => e.path === 'baseUrl').value
          const uiUrl = config.find(e => e.path === 'uiUrl').value

          const workspace = await createWorkspace(baseUrl, authToken, generateTemplate(this.url, runs))
          const shareUrl = `${uiUrl}/#/workspaces/share/${workspace.accessToken}`
          if (confirm(`Open  ${shareUrl}`)) {
            window.open(shareUrl, 'blank')
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/variables";

</style>
