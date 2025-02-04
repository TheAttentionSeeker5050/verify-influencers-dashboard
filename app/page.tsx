import Link from 'next/link'

// This is how you would import FontAwesome icons in a page component
// Source: https://docs.fontawesome.com/web/use-with/react
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faThumbsUp } from '@fortawesome/free-solid-svg-icons'

export default function DashboardPage() {
  return (
    <main id="main-page" className="p-4 max-w-4xl mx-auto gap-3 border-2 border-white rounded-lg my-4 bg-slate-800">
      <h1 className='font-semibold text-2xl '>Home</h1>
      
      <section id='links-secton' className='flex flex-row gap-4 hover:*:text-emerald-300 *:text-emerald-500'>
        <Link href="/leaderboard">Leaderboard</Link>
        <Link href="/research">Run Research Task</Link>
      </section>

    </main>)
}