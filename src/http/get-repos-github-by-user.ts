export interface GetReposGithubByUserResponse {
  id: number
  name: string
  url: string
  language: string
  createdAt: string
  updatedAt: string
}

export async function getReposGithubByUser(
  username: string
): Promise<GetReposGithubByUserResponse[] | null> {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos`
    )

    if (!response.ok) throw new Error('Failed to fetch repos')

    const data = await response.json()

    const repos = data.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      url: repo.svn_url,
      language: repo.language,
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
    }))

    return repos
  } catch (error) {
    console.log(error)
    return null
  }
}
