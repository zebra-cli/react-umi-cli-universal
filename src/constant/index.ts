export const FLATEFORM_SITE = 2 // 1-后台；2-前台

export const EXTRA_AUTH_STR = 'role'

export const UPLOAD_FRE = ['', '周度', '月度', '季度', '不定期']
export const WEEK_TEXT = [0, '一', '二', '三', '四', '五', '六', '日']

export const TEMPLATE_UPLOAD = [
  [],
  Array.from(Array(8), (_, index) => ({
    id: WEEK_TEXT[index],
    name: `周${WEEK_TEXT[index]}`
  })).slice(1),
  Array.from(Array(32), (_, index) => ({
    id: index,
    name: `${index}日`
  })).slice(1),
  Array.from(Array(93), (_, index) => ({ id: index, name: `${index}` })).slice(
    1
  ),
  [
    {
      id: '不定期',
      name: '不定期'
    }
  ]
]

export const MONTH = Array.from(Array(13), (_, index) => ({
  id: index,
  name: `${index}月`
})).slice(1)

function getYearData() {
  let currentYear = new Date().getFullYear()
  const yearData = []
  while (currentYear) {
    if (currentYear < 2019) {
      break
    }
    yearData.push({
      id: currentYear,
      name: `${currentYear}年`
    })
    currentYear -= 1
  }
  return yearData
}

export const YEAR = getYearData()
