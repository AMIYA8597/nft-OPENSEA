
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
// import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { BanIcon, BellIcon, XIcon } from "@heroicons/react/outline";

import Link from "next/link";
import logo from "@images/small-eth.webp"
import ActiveLink from "../link";
import { useWeb3 } from "@/components/providers/web3";
import { useAccount } from "@/components/hooks/web3/useAccount";
import { useNetwork } from "@/components/hooks/web3";

const navigation = [
  { name: "MarketPlace", href: "/", current: true },
  { name: "Create", href: "/create", current: false },
  // { name: 'Projects', href: '#', current: false },
  // { name: 'Calendar', href: '#', current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const {contract} = useWeb3()
  console.log("this is inside navbar", contract );

  // useAccount();
  // const { network } = useNetwork();

  // const {data} = useAccount("some random params");
  // console.log("data is",data);

// const accountHook = useAccount("some random params");
// console.log("useAccount result:", accountHook);


  
  
  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
               p0: stringp0: stringp0?: string   <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <BanIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <img
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                    alt="Your Company"
                  />
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <ActiveLink
                        key={item.name}
                        href={item.href}
                        activeclass="bg-gray-900 text-white"
                        className="bg-gray-900 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium "
                        aria-current={item.current ? "page" : undefined}
                      >
                        <>   
                        {item.name}
                        </>
                        
                      </ActiveLink>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button
                  type="button"
                  className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/profile"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Your Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Settings
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Sign out
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
































// import { Disclosure, Menu } from '@headlessui/react';
// import { MenuIcon, XIcon } from '@heroicons/react/outline';
// import { useAccount, useNetwork } from '@hooks/web3';
// import Link from "next/link";
// import ActiveLink from '../link';
// import Walletbar from './Walletbar';

// const navigation = [
//   { name: 'Marketplace', href: '/', current: true },
//   { name: 'Create', href: '/nft/create', current: false }
// ];

// function classNames(...classes: string[]) {
//   return classes.filter(Boolean).join(' ');
// }

// export default function Navbar() {
//   const { account } = useAccount();
//   const { network } = useNetwork();

//   return (
//     <Disclosure as="nav" className="bg-gray-800">
//       {({ open }) => (
//         <>
//           <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
//             <div className="relative flex items-center justify-between h-16">
//               <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
//                 {/* Mobile menu butt*/}
//                 <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
//                   <span className="sr-only">Open main menu</span>
//                   {open ? (
//                     <XIcon className="block h-6 w-6" aria-hidden="true" />
//                   ) : (
//                     <MenuIcon className="block h-6 w-6" aria-hidden="true" />
//                   )}
//                 </Disclosure.Button>
//               </div>
//               <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
//                 <div className="flex-shrink-0 flex items-center">
//                   <img
//                     className="hidden lg:block h-10 w-auto"
//                     src="/images/page_logo.png"
//                     alt="Workflow"
//                   />
//                 </div>
//                 <div className="hidden sm:block sm:ml-6">
//                   <div className="flex space-x-4">
//                     {navigation.map((item) => (
//                       <ActiveLink
//                         key={item.name}
//                         href={item.href}
//                         activeclass="bg-gray-900 text-white"
//                       >
//                         <Menu as="div" className="relative">
//                           <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
//                             <Menu.Item>
//                               {({ active }) => (
//                                 <Link
//                                   href="/profile"
//                                   className={classNames(
//                                     active ? "bg-gray-100" : "",
//                                     "block px-4 py-2 text-sm text-gray-700"
//                                   )}
//                                 >
//                                   Your Profile
//                                 </Link>
//                               )}
//                             </Menu.Item>
//                           </Menu.Items>
//                         </Menu>
//                       </ActiveLink>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//               {/* <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
//                 <div className="text-gray-300 self-center mr-2">
//                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-purple-100 text-purple-800">
//                     {network.data ? (
//                       <>
//                         <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-indigo-400" fill="currentColor" viewBox="0 0 8 8">
//                           <circle cx={4} cy={4} r={3} />
//                         </svg>
//                         {network.data} ---
//                         {`Is supported: ${network.isSupported}`} ---
//                         Target: {network.targetNetwork}
//                       </>
//                     ) : (
//                       "Network data not available"
//                     )}
//                   </span>
//                 </div>
//                 <Walletbar
//                   isInstalled={account.isInstalled}
//                   isLoading={account.isLoading}
//                   connect={account.connect}
//                   account={account.data}
//                 />
//               </div> */}
//             </div>
//           </div>

//           <Disclosure.Panel className="sm:hidden">
//             <div className="px-2 pt-2 pb-3 space-y-1">
//               {navigation.map((item) => (
//                 <Disclosure.Button
//                   key={item.name}
//                   as="a"
//                   href={item.href}
//                   className={classNames(
//                     item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
//                     'block px-3 py-2 rounded-md text-base font-medium'
//                   )}
//                   aria-current={item.current ? 'page' : undefined}
//                 >
//                   {item.name}
//                 </Disclosure.Button>
//               ))}
//             </div>
//           </Disclosure.Panel>
//         </>
//       )}
//     </Disclosure>
//   );
// }




















































