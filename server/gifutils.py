import math
import moviepy.editor as mp
import os


def save_gif_frames(gif_path):
    gif = mp.VideoFileClip(gif_path)
    file_name = os.path.basename(gif_path)
    len_seconds = math.floor(gif.duration)
    snapshot_paths = []

    for i in range(0, len_seconds + 1):
        snapshot_path = "./temp/" + file_name + str(i) + ".jpg"
        gif.save_frame(snapshot_path, t=i)
        snapshot_paths.append(snapshot_path)
    print(snapshot_paths)
    return snapshot_paths


def delete_paths(paths):
    for path in paths:
        os.remove(path)
