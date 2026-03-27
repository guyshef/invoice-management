import { addFolder } from '../src/app/company/[id]/actions'

// Mock next/cache
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}))

// Mock the Supabase server client
const mockInsert = jest.fn()
const mockGetUser = jest.fn()

jest.mock('../src/utils/supabase/server', () => ({
  createClient: jest.fn(() =>
    Promise.resolve({
      auth: {
        getUser: mockGetUser,
      },
      from: jest.fn(() => ({
        insert: mockInsert,
      })),
    })
  ),
}))

const COMPANY_ID = 'company-tommy-emma-123'
const USER_ID = 'user-abc-456'

function makeFormData(name: string, year: string | number) {
  const fd = new FormData()
  fd.append('name', name)
  fd.append('year', String(year))
  return fd
}

describe('addFolder — Tommy and Emma LLC scenario', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('creates a folder successfully — year 2026, no user_id column on folders table', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: USER_ID } } })
    mockInsert.mockResolvedValue({ error: null })

    const result = await addFolder(COMPANY_ID, makeFormData('Tax', 2026))

    expect(result).toEqual({ success: true })
    // folders table has no user_id column — insert must NOT include it
    expect(mockInsert).toHaveBeenCalledWith([
      { company_id: COMPANY_ID, name: 'Tax', year: 2026 },
    ])
  })

  it('returns an error when user is not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })

    const result = await addFolder(COMPANY_ID, makeFormData('Insurance', 2026))

    expect(result).toEqual({ error: 'Not authenticated' })
    expect(mockInsert).not.toHaveBeenCalled()
  })

  it('returns an error when folder name is missing', async () => {
    const result = await addFolder(COMPANY_ID, makeFormData('', 2026))

    expect(result).toEqual({ error: 'Missing folder name or year' })
    expect(mockInsert).not.toHaveBeenCalled()
  })

  it('returns an error when year is missing', async () => {
    const result = await addFolder(COMPANY_ID, makeFormData('Tax', ''))

    expect(result).toEqual({ error: 'Missing folder name or year' })
    expect(mockInsert).not.toHaveBeenCalled()
  })

  it('surfaces a database error message', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: USER_ID } } })
    mockInsert.mockResolvedValue({
      error: { message: 'new row violates row-level security policy' },
    })

    const result = await addFolder(COMPANY_ID, makeFormData('Payroll', 2026))

    expect(result).toEqual({
      error: 'DB Error: new row violates row-level security policy',
    })
  })
})
