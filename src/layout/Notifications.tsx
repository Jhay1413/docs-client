// import axios from 'axios'
// import { useEffect, useState } from 'react'

// export default function Notifications(query:string, pageNumber) {
  
//     useEffect(() => {
//         let cancel
//         axios({
//             method:'GET',
//             url: 'http://openlibrary.org/search.json',
//             params: {q: query, page: pageNumber },
//             cancelToken: new axios.CancelToken(c => cancel = c)
//         }).then(res => {
//             console.log(res.data)
//         }).catch(e => {
//             if (axios.isCancel(e)) return
//         })

//         return () => cancel()
//     }, [query, pageNumber])
  
//     return null
// }


import React, { useEffect, useState } from 'react';
import axios, { Canceler } from 'axios';

interface NotificationsProps {
  query: string;
  pageNumber: number;
}

const Notifications: React.FC<NotificationsProps> = ({ query, pageNumber }) => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [notifs, setNotifs] = useState<string[]>([]);
    const [hasMore, setHasMore] = useState(false);
    

    useEffect(() => {
        setLoading(true);
        setError(false);
        let cancel: Canceler;
        axios({
            method: 'GET',
            url: 'http://openlibrary.org/search.json',
            params: { q: query, page: pageNumber },
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(res => {
            setNotifs(prevNotifs => {
                return [...new Set([...prevNotifs, ...res.data.docs.map((b: { title: string }) => b.title)])];
            });
            setHasMore(res.data.docs.length > 0);
            setLoading(false);
            console.log(res.data);
        }).catch(e => {
            if (axios.isCancel(e)) return;
            setError(true);
        });

        return () => cancel();
    }, [query, pageNumber]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error occurred</div>;

    return (
        <div>
            {notifs.map((notif, index) => (
                <div key={index}>{notif}</div>
            ))}
            {hasMore && <div>Load more...</div>}
        </div>
    );
};

export default Notifications;
