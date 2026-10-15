import './globals.css';
import type {Metadata} from 'next';
export const metadata:Metadata={title:'Progressive Autosports',icons:{icon:'/assets/1bf4a751b55b-prog-auto-logo.png'},robots:{index:false,follow:false}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
