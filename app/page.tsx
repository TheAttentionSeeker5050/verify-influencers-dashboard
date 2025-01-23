import Link from 'next/link'

// This is how you would import FontAwesome icons in a page component
// Source: https://docs.fontawesome.com/web/use-with/react
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faThumbsUp } from '@fortawesome/free-solid-svg-icons'

export default function Page() {
  return (
    <div>
      <h1>Home</h1>
      <Link href="/about">About</Link>
    </div>
  )
}