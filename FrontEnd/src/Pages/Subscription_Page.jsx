const channels = [
  { name: 'Mr Least', subs: '200M Subscribers', joined: '12-05-2002',img:'https://newkgfindia.com/assets/users2.avif'},
  { name: 'King King', subs: '22M Subscribers', joined: '12-05-2002',img:'https://newkgfindia.com/assets/users1.avif' },
  { name: 'Mr Least', subs: '200M Subscribers', joined: '12-05-2002',img:'https://newkgfindia.com/assets/users3.avif' },
  { name: 'King King', subs: '22M Subscribers', joined: '12-05-2002',img:'https://newkgfindia.com/assets/users4.avif' },
  { name: 'Mr Least', subs: '200M Subscribers', joined: '12-05-2002',img:'https://newkgfindia.com/assets/users5.avif' },
  { name: 'King King', subs: '22M Subscribers', joined: '12-05-2002',img:'https://newkgfindia.com/assets/users6.avif' },
  { name: 'Mr Least', subs: '200M Subscribers', joined: '12-05-2002',img:'https://newkgfindia.com/assets/users7.avif' },
  { name: 'King King', subs: '22M Subscribers', joined: '12-05-2002',img:'https://newkgfindia.com/assets/users8.avif' },
];

export default function Subscription_Page() {
  return (
    <div className="min-h-screen text-white px-4 py-6">
      <h2 className="text-[30px] font-semibold mb-6">Subscribed Channels</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {channels.map((channel, index) => (
          <div
            key={index}
            className="bg-[#2c2c2c] flex items-center gap-4 p-4 rounded"
          >
            <img
              src={channel.img}
              alt="Channel Icon"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <p className="font-medium text-xl">{channel.name}</p>
              <p className="text-sm text-gray-300">{channel.subs}</p>
              <p className="text-sm text-gray-400">{channel.joined}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
