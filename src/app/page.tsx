'use client'

import { getReposGithubByUser } from '@/http/get-repos-github-by-user'
import { queryClient } from '@/lib/react-query'
import { useQuery } from '@tanstack/react-query'
import { Loader2, SearchIcon } from 'lucide-react'
import Link from 'next/link'
import { useState, type ChangeEvent, type FormEvent } from 'react'

export default function Home() {
  const [username, setUsername] = useState<string>('')
  const [search, setSearch] = useState<string>('')

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['repo', username],
    queryFn: () => getReposGithubByUser(username),
    enabled: !!username,
  })

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value)
  }

  function handleUsernameChange(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    const username = data.get('username') as string

    setUsername(username)
    queryClient.invalidateQueries({ queryKey: ['repo', username] })
    refetch()
  }

  const filteredRepos = data
    ?.filter(repo => repo.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (a.language > b.language) {
        return -1
      }

      if (a.language < b.language) {
        return 1
      }

      return 0
    })

  return (
    <div className="px-6 py-4 space-y-4">
      <form
        onSubmit={handleUsernameChange}
        className="flex items-center justify-center gap-2"
      >
        <div className="flex items-center gap-3 bg-zinc-800 text-zinc-50 rounded-lg pr-3">
          <input
            name="username"
            id="username"
            placeholder="Procure uma conta"
            className="bg-zinc-800 text-zinc-50 rounded-lg px-3 py-2 outline-none"
            autoComplete="off"
          />

          <button type="submit">
            <SearchIcon />
          </button>
        </div>
      </form>

      <div className="flex flex-col items-center gap-2 justify-center">
        <h2 className="font-bold text-2xl">Repositórios</h2>

        <span className="text-lg">
          Total: {filteredRepos ? filteredRepos.length : 0}
        </span>

        <input
          name="search"
          id="search"
          placeholder="Pesquise um repositório"
          value={search}
          onChange={handleSearchChange}
          className="bg-zinc-800 text-zinc-50 rounded-lg px-3 py-2 outline-none w-full xl:w-2/12 placeholder:text-center focus-within:text-center"
        />
      </div>

      <div className="bg-zinc-700 w-full h-px" />

      <div
        className={`grid ${filteredRepos && filteredRepos?.length <= 3 ? 'grid-cols-1' : 'grid-cols-4'} gap-4 justify-self-center`}
      >
        {filteredRepos?.map(repo => {
          return (
            <Link
              key={repo.id}
              href={repo.url ?? ''}
              target="_blank"
              className="px-6 py-2 bg-zinc-700 hover:bg-zinc-800 rounded-lg text-center transition-all"
            >
              {repo.name}
              <p>{repo.language ? repo.language : 'README'}</p>
              <p>
                {new Date(repo.createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}{' '}
                -{' '}
                {new Date(repo.updatedAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </p>
            </Link>
          )
        })}

        {isLoading ? (
          <div className="col-span-4">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          !filteredRepos && (
            <div className="col-span-4">
              <p className="text-zinc-500">Nenhum repositório encontrado</p>
            </div>
          )
        )}
      </div>
    </div>
  )
}
