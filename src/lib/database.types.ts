export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tips: {
        Row: {
          id: string
          sport: 'nba' | 'futebol'
          league: string
          match: string
          time: string
          date: string
          tip: string
          odds: number
          confidence: number
          status: 'green' | 'red' | 'pending'
          analysis: string
          is_vip: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sport: 'nba' | 'futebol'
          league: string
          match: string
          time: string
          date: string
          tip: string
          odds: number
          confidence: number
          status?: 'green' | 'red' | 'pending'
          analysis: string
          is_vip?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sport?: 'nba' | 'futebol'
          league?: string
          match?: string
          time?: string
          date?: string
          tip?: string
          odds?: number
          confidence?: number
          status?: 'green' | 'red' | 'pending'
          analysis?: string
          is_vip?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      statistics: {
        Row: {
          id: string
          total_tips: number
          green_tips: number
          red_tips: number
          win_rate: number
          roi: string
          updated_at: string
        }
        Insert: {
          id?: string
          total_tips?: number
          green_tips?: number
          red_tips?: number
          win_rate?: number
          roi?: string
          updated_at?: string
        }
        Update: {
          id?: string
          total_tips?: number
          green_tips?: number
          red_tips?: number
          win_rate?: number
          roi?: string
          updated_at?: string
        }
      }
    }
  }
}
