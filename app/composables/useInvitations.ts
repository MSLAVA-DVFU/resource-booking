
import { initialInvitations } from '~/data/users'
import type { Invitation } from '~/data/users'

export function useInvitations() {
  const invitations = useState<Invitation[]>(
    'demo-invitations',
    () => initialInvitations.map(item => ({
      ...item,
      slotIds: [...item.slotIds],
    })),
  )

  function declineInvitation(id: number): void {
    invitations.value = invitations.value.filter(
      invitation => invitation.id !== id,
    )
  }

  return {
    invitations,
    declineInvitation,
  }
}