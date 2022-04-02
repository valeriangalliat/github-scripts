async function auditMeta (repos) {
  const parser = new DOMParser()

  for (const repo of repos) {
    const res = await fetch(`https://github.com/${repo}`)
    const html = await res.text()
    const dom = parser.parseFromString(html, 'text/html')

    const form = dom.querySelector('form[action$=update_meta]')
    const data = new FormData(form)

    if (['releases', 'packages', 'environments'].every(key => data.get(`repo_sections[${key}]`) === '0')) {
      console.log(`Skipping ${repo} (already good)`)
      continue
    }

    data.set('repo_sections[releases]', '0')
    data.set('repo_sections[packages]', '0')
    data.set('repo_sections[environments]', '0')

    const body = new URLSearchParams(data).toString()

    await fetch(form.action, {
      method: form.method,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body
    })

    if (res.ok) {
      console.log(`Updated ${repo}`)
    } else {
      console.log(`Failed to process ${repo}`)
    }
  }
}
