/**
 * Enum representing the possible status of a Magic Mover.
 * 
 * This enum is used to define the state of a Magic Mover in the system.
 * The status is as follows:
 * - `RESTING`: The Magic Mover is not in use and is in a resting state.
 */
export enum MagicMoverStatus {
  /**
   * The Magic Mover is idle and not currently engaged in any task.
   * Typically used when the mover is waiting for an action, such as loading items or starting a mission.
   */
  RESTING = 'Resting',

}
