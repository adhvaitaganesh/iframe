import { Suspense } from 'react'
import { TweetSkeleton, EmbeddedTweet, TweetNotFound } from 'react-tweet'
import { fetchTweet, Tweet } from 'react-tweet/api'
import { kv } from '@vercel/kv'
 
async function getTweet(
  id: string,
  fetchOptions?: RequestInit
): Promise<Tweet | undefined> {
  try {
    const { data, tombstone, notFound } = await fetchTweet(id, fetchOptions)
 
    if (data) {
      await kv.set(`tweet:${id}`, data)
      return data
    } else if (tombstone || notFound) {
      // remove the tweet from the cache if it has been made private by the author (tombstone)
      // or if it no longer exists.
      await kv.del(`tweet:${id}`)
    }
  } catch (error) {
    console.error('fetching the tweet failed with:', error)
  }
 
  const cachedTweet = await kv.get<Tweet>(`tweet:${id}`)
  return cachedTweet ?? undefined
}
 
const TweetPage = async ({ id }: { id: string }) => {
  try {
    const tweet = await getTweet(id)
    return tweet ? <EmbeddedTweet tweet={tweet} /> : <TweetNotFound />
  } catch (error) {
    console.error(error)
    return <TweetNotFound error={error} />
  }
}
 
export const Page = ({ params }: { params: { tweet: string } }) => {
 return (
  <>
  <div>
   <Suspense fallback={<TweetSkeleton />}>
     <TweetPage id={params.tweet} />
   </Suspense>
  </div>
  </>
) ;
};
 
//export default Page
