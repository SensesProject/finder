<template>
  <button :class="['btn', 'btn--light', { clickable: isClickable }, { error: isError }]" v-tooltip="{ content: message ? message : 'Open selected scenarios in IIASA Explorer', placement: 'bottom', open: message, trigger: message ? 'manual' : 'hover focus' }" @click="openExplorer"><i class="icon-export" /> Open in Explorer</button>
</template>

<script>
  import { mapState } from 'vuex'
  import { get, map, compact } from 'lodash'
  import copy from 'copy-to-clipboard'

  import { basket } from '~/store/index'

  const APP_NAME = 'IXSE_SR15'
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

  function generateTemplate (runs) {
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
            'markdown': `# Senses Scenario Finder workspace`
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
    data: function () {
      return {
        message: false,
        isClickable: true,
        isError: false
      }
    },
    computed: {
      ...mapState('datum', [
        'datum'
      ])
      // ...mapGetters([
      //   'urlString'
      // ]),
      // url () {
      //   const getUrl = window.location
      //   return `${getUrl.protocol}//${getUrl.host}${this.$router.options.base}${this.urlString}`
      // }
    },
    methods: {
      openExplorer () {
        this.isClickable = false
        this.message = 'Loading'
        this.onCreate()
      },
      reset () {
        this.isError = false
        this.message = false
        this.isClickable = true
      },
      displayError (message) {
        this.isError = true
        this.message = message
        setTimeout(() => {
          this.reset()
        }, 2000)
      },
      async onCreate () {
        const runs = compact(map(basket.all(), run => {
          return get(run, 'run_id', false)
        }))
        if (runs.length) {
          const username = 'scenario-finder'
          const password = 'g2qo@mBB!uPXsmwVAzJ-'
          if (!username || !password) return
          const authToken = await login(username, password).catch((error) => { this.displayError(error) })
          const config = await getAppConfig(authToken, APP_NAME).catch((error) => { this.displayError(error) })
          const baseUrl = config.find(e => e.path === 'baseUrl').value
          const uiUrl = config.find(e => e.path === 'uiUrl').value
          const workspace = await createWorkspace(baseUrl, authToken, generateTemplate(runs)).catch((error) => { this.displayError(error) })
          const shareUrl = `${uiUrl}/#/workspaces/share/${workspace.accessToken}`
          copy(shareUrl)
          this.message = 'URL copied to clipboard'
          setTimeout(() => {
            this.reset()
          }, 2000)
          if (confirm(`The URL to the workspace is copied to your clipboard. Do you also want to open it in a new window?`)) {
            window.open(shareUrl, '_blank')
          }
        } else {
          this.displayError('No scenarios selectable')
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/global";

  .btn{
    &.error {
      color: #99242e;
      border-color: #99242e;
    }
  }

</style>
