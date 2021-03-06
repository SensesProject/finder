export const KEY_DIMENSION = 'dimension'
export const KEY_TYPE = 'type'
export const KEY_ID = 'id'
export const KEY_UNIQ_ID = 'uniqueID'
export const KEY_STATUS = 'status'
export const KEY_INIT = 'init'

export const STATUS_IDLE = 'IDLE'
export const STATUS_LOADING = 'LOADING'
export const STATUS_LOADING_FAILED = 'LOADING_FAILED'
export const STATUS_LOADING_SUCCESS = 'LOADING_SUCCESS'
export const STATUS_EMPTY = 'EMPTY'

export const ITEMS_PER_PAGE = 50

export const KEY_FILTER_TYPE_LIST = 'List'
export const KEY_FILTER_TYPE_SEARCH = 'Search'
export const KEY_FILTER_TYPE_HISTOGRAM = 'Histogram'
export const KEY_FILTER_TYPE_DETAILS = 'Details'

export const NUMBERIC_FACET_TYPES = [KEY_FILTER_TYPE_HISTOGRAM, KEY_FILTER_TYPE_DETAILS]

export const KEY_FILTER_VALID = [KEY_FILTER_TYPE_LIST, KEY_FILTER_TYPE_SEARCH, KEY_FILTER_TYPE_HISTOGRAM, KEY_FILTER_TYPE_DETAILS, '']

export const STATUS_AUTH = 'AUTH'
export const STATUS_AUTH_FAILED = 'AUTH_FAILED'
export const STATUS_AUTH_SUCCESS = 'AUTH_SUCCESS'

export const KEY_FILTER = 'newfilter'
export const KEY_FILTER_INIT = 'initFilter'

export const KEY_DATE = 'date'
export const KEY_URL = 'url'

export const KEY_FACETS_ALL = 'allFacets'
export const KEY_FACETS_VISIBLE = 'visibleFacets'
export const KEY_FACETS_FACETS = 'facets'

export const KEY_PATH = 'path'
export const KEY_TOOLTIP = 'tooltip'
export const KEY_LABEL = 'label'

export const KEY_HAS_ACTIVE_FILTERS = 'hasActiveFilters'

export const RESET_CODE = 'reset'

// Details config
export const DEFAULT_REGION = 'World'
export const DEFAULT_YEAR = 2030

export const SELECTION_YEARS = [2030, 2050, 2100]

export const REGION_MAPPING = {
  'World': 'World',
  'Asian countries except Japan': 'R5ASIA',
  'Latin American countries': 'R5LAM',
  'Countries of the Middle East and Africa': 'R5MAF',
  'OECD90 and EU countries': 'R5OECD90+EU',
  'Countries of the Former Soviet Union': 'R5REF',
  'Rest of the World': 'R5ROWO'
}

export const FACET_KEYS = [
  'key', // The path to the value in the object
  'label', // The label that is displayed above the facet
  'unit', // The unit of the column in displayed after the label
  'group', // This organises the elements in the facet select popover
  'regions', // This defines the regions that can be requested for the detail facet
  'title', // This is only used for the first column (TODO)
  'system', // This is only used for the key (TODO)
  'tooltip', // This information is displayed when hovering the tooltip
  'type', // This defines the type of the facet
  'visible', // This defines whether the facet is visible on default
  'popover.content',
  'popover.key',
  'popover.path',
  'popover.url'
]
