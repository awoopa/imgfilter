import moviepy.editor as mp
import numpy as np


def get_flash_count(gif_path):
    # Get GIF dimensions and length
    gif = mp.VideoFileClip(gif_path)
    [gif_width, gif_height] = gif.size
    total_gif_length = gif.duration
    frames = [frame for frame in gif.iter_frames()]

    # Count the number of flashes between frames
    flash_count = 0
    framediff_flash_threshold = 0.5
    for i in range(1, len(frames)):
        frame_prev = np.array(frames[i], dtype=int)
        frame_cur = np.array(frames[i - 1], dtype=int)
        print(frames[i][0][0])
        framediff_norm = np.linalg.norm(frame_cur - frame_prev) / (gif_width * gif_height)
        print(framediff_norm)
        if (framediff_norm > framediff_flash_threshold):
            flash_count += 1

    # Compute number of flashes per second
    normalized_flash_count = flash_count * (1 / total_gif_length)
    return normalized_flash_count


def is_gif_safe(gif_path):
    normalized_flash_count = get_flash_count(gif_path)
    print(normalized_flash_count)
    if normalized_flash_count > 3:
        return False
    else:
        return True
