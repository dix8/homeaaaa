import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Api from '../utils/api'
import Head from 'next/head'

interface SiteSettings {
  id?: number;
  title?: string;
  pageTitle?: string;
  favicon?: string | null;
  logo?: string | null;
  description?: string | null;
  keywords?: string | null;
  copyright?: string | null;
  icp?: string | null;
  gongan?: string | null;
}

export default function App({ Component, pageProps }: AppProps) {
  const [settings, setSettings] = useState<SiteSettings>({})
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const loadSettings = async () => {
      try {
        const response = await Api.getSettings()
        if (response.data) {
          const newSettings: SiteSettings = {
            id: response.data.id,
            title: response.data.title || undefined,
            pageTitle: response.data.pageTitle || undefined,
            logo: response.data.logo,
            favicon: response.data.favicon,
            description: response.data.description || undefined,
            keywords: response.data.keywords || undefined,
            copyright: response.data.copyright || undefined,
            icp: response.data.icp || undefined,
            gongan: response.data.gongan || undefined,
          }
          setSettings(newSettings)
        }
      } catch (error) {
        console.error('Failed to load site settings:', error)
      }
    }

    loadSettings()
  }, [])

  // 使用路由判断是否为管理页面
  const isAdminPage = router.pathname.startsWith('/admin')

  // 获取当前后台页面名称
  const getAdminPageName = () => {
    const path = router.pathname
    if (path.includes('/admin/settings')) return 'Settings'
    if (path.includes('/admin/profile')) return 'Profile'
    if (path.includes('/admin/skills')) return 'Skills'
    if (path.includes('/admin/projects')) return 'Projects'
    return 'Dashboard'
  }

  // 在客户端渲染之前返回一个基础布局
  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow">
          <Component {...pageProps} />
        </main>
      </div>
    )
  }

  const footerProps = {
    copyright: settings.copyright || undefined,
    icp: settings.icp || undefined,
    gongan: settings.gongan || undefined
  }

  return (
    <div>
      <Head>
        <title>
          {isAdminPage 
            ? `后台管理|${settings.pageTitle}-${getAdminPageName()}`
            : settings.pageTitle || settings.title || '个人主页'
          }
        </title>
        <meta name="description" content={settings.description || '个人主页'} />
        {settings.keywords && <meta name="keywords" content={settings.keywords} />}
        {settings.favicon && <link rel="icon" href={settings.favicon} />}
      </Head>
      <div className="min-h-screen flex flex-col">
        {!isAdminPage && <Header title={settings.title} logo={settings.logo} />}
        <main className="flex-grow">
          <Component {...pageProps} settings={settings} />
        </main>
        {!isAdminPage && <Footer {...footerProps} />}
      </div>
    </div>
  )
} 