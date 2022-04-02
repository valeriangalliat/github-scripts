import { Octokit } from '@octokit/rest'
import fs from 'fs/promises'

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
})

const repos = await octokit.paginate('GET /user/repos?affiliation=owner')
const meta = []

for (const repo of repos) {
  if (repo.fork) {
    continue
  }

  meta.push(repo.full_name)

  if (repo.has_wiki || repo.has_projects) {
    console.log(repo.name, repo.has_wiki, repo.has_projects)

    // await octokit.rest.repos.update({
    //   owner: repo.owner.login,
    //   repo: repo.name,
    //   has_wiki: false,
    //   has_projects: false
    // })
  }
}

console.log()
console.log(`auditMeta(${JSON.stringify(meta)})`)
